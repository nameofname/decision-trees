"use strict";


const moment = require('moment');
const logger = require('./logger');

const isMysqlDate = date => {
    return moment(date, "YYYY-MM-DD HH:mm:ss", true).isValid(); // string parsing.
};
const isNumber = num => Number(num).toString() === num.toString();
const isString = str => true;
const isNull = n => n === null || n === 'NULL';
const isUndefined = n => n === undefined;
const isBool = bool => {
    return [0, 1, true, false].includes(bool);
};

const formatDate = int => moment(int).format("YYYY-MM-DD HH:mm:ss");

/**
 * if something is a date every time, it's a date
 * if something is a number every time, it's a number
 * if it misses being a date or number one or more times, it's a string
 * if it's true, false, 0, or 1 - every time, it's boolean
 * but if it misses being boolean and it's a number, then it may be a number if we previously had only 0 and 1
 */
const getType = value => {
    switch (true) {
        case isNull(value) :
            return null;
        case isUndefined(value) :
            return null;
        case isMysqlDate(value) :
            return Date;
        case isBool(value) :
            return Boolean;
        case isNumber(value) :
            return Number;
        case isString(value) :
            return String;
        default :
            logger.error('unable to find type for :', value);
            return undefined;
    }
};

/**
 * The true type follows intuitive rules. For example, if the type list includes boolean, then it could values like :
 *      [0, 1, NULL, 3]
 * In this case we should consider it a number because for it to be an actual boolean, it would only have 0 or 1 values.
 * On the other hand, if we have a date, then we could have had values like this :
 *      ['2016-05-09 11:00:00', 'popsicles', '2016-05-10 12:00:00', 'animal bones']
 *      ['2016-05-09 11:00:00', NULL, NULL, '2016-05-10 12:00:00']
 * In this case the first is not a date, it's a string, but the second is a date
 */
const getTrueType = typeHistory => {
    if (typeHistory.includes(Date)) {
        if (typeHistory.includes(String)) {
            return String;
        } else if (typeHistory.includes(Number)) {
            return Number;
        } else {
            return Date;
        }
    }
    if (typeHistory.includes(Number)) {
        if (typeHistory.includes(String)) {
            return String;
        } else {
            return Number;
        }
    }
    if (typeHistory.includes(Boolean)) {
        typeHistory = typeHistory.filter(t => t === Boolean);
        if (typeHistory.length > 1) {
            return getTrueType(typeHistory);
        } else {
            return typeHistory[0];
        }
    }
    if (typeHistory.includes(String)) {
        return String;
    }
};

/**
 * Break a low and high number (or date) into ranges.
 */
const getRanges = (Type, low, high, segmentNum = 3) => {
    const difference = high - low;
    const segmentLength = difference / segmentNum;
    let segments = [];

    for (let i = 1; i <= segmentNum; i++) {
        let lowerBound = i === 1 ? low : segments[segments.length - 1][1];
        let upperBound = lowerBound + segmentLength;
        segments.push([lowerBound, upperBound]);
    }

    if (Type === Date) {
        segments = segments.map(([lower, upper]) => {
            return [
                formatDate(Math.floor(lower)),
                formatDate(Math.ceil(upper))
            ];
        });
    }

    logger.trace(`discovered range ${JSON.stringify(segments)}`);
    return segments;
};

const newDefinition = (fieldDescriptions, fieldName) => {
    logger.trace(`newDefinition for ${fieldName}`);
    fieldDescriptions.set(fieldName, new Map());
    const map = fieldDescriptions.get(fieldName);
    map.set('fieldName', fieldName);
    map.set('allValues', new Map());
    map.set('valueRanges', new Map());
    map.set('typeHistory', []);
};

const addValue = (fieldDescriptions, fieldName, value, type) => {
    logger.trace(`addValue for ${fieldName} - ${value}`);
    const fieldDescription = fieldDescriptions.get(fieldName);

    if (fieldDescription) {
        fieldDescription.get('allValues').set(value, true);
        if (!fieldDescription.get('typeHistory').includes(type)) {
            fieldDescription.get('typeHistory').push(type);
        }

        // format ranges into a min and max :
        if (type === Date || type === Number || type === Boolean) {
            const suffix = type === Date ? 'Date' : 'Number';
            const lowestKey = `lowest${suffix}`;
            const highestKey = `highest${suffix}`;
            let lowest = fieldDescription.get(lowestKey);
            let highest = fieldDescription.get(highestKey);

            if (type === Date) {
                value = Date.parse(value);
            } else {
                value = Number(value);
            }

            if (lowest === undefined || value < lowest) {
                lowest = (type === Date) ? Date.parse(lowest) : lowest;
                fieldDescription.set(lowestKey, value);
            }
            if (highest=== undefined || value > highest) {
                highest = (type === Date) ? Date.parse(highest) : highest;
                fieldDescription.set(highestKey, value);
            }
        }

        return fieldDescription;
    }

    logger.error(`could not find description for ${fieldName} - ${value}`)
};

/**
 * Expects JSON converted from CSV file
 */
module.exports = json => {

    const fieldDescriptions = new Map();

    json.forEach((obj, idx) => {
        Object.keys(obj).forEach(key => {
            if (idx === 0) {
                newDefinition(fieldDescriptions, key)
            }

            const val = obj[key];
            const type = getType(val);
            addValue(fieldDescriptions, key, val, type);
        });
    });

    for (let entry of fieldDescriptions.entries()) {

        const [fieldName, fieldDescription] = entry;
        const typeHistory = fieldDescription.get('typeHistory');

        let trueType = typeHistory[0];
        if (typeHistory.length > 1) {
            trueType = getTrueType(typeHistory);
        }

        fieldDescription.set('trueType', trueType);

        if (trueType === Number || trueType === Date) {
            const suffix = trueType === Date ? 'Date' : 'Number';
            const lowestKey = `lowest${suffix}`;
            const highestKey = `highest${suffix}`;
            const lowest = fieldDescription.get(lowestKey);
            const highest = fieldDescription.get(highestKey);
            const ranges = getRanges(trueType, lowest, highest);
            fieldDescription.set('ranges', ranges);

            // console.log(ranges)
            // TODO ! assign ranges to values.

        } else if (trueType === String) {
            // TODO ! check the number of different strings! if it's relatively few, then proceed, otherwise, ignore.
        }
    }

    return fieldDescriptions;
};
