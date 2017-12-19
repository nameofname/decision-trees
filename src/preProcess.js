"use strict";


const moment = require('moment');
const logger = require('./logger');

const isDate = date => {
    let isDate = false;
    try {
        isDate = moment(date).isValid()
    } catch (e) {
        isDate = false
    }
    return isDate;
};
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

// if something is a date every time, it's a date
// if something is a number every time, it's a number
// if it misses being a date or number one or more times, it's a string
// if it's true, false, 0, or 1 - every time, it's boolean
// but if it misses being boolean and it's a number, then it may be a number if we previously had only 0 and 1
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
 * @param typeHistory
 * @returns {*}
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
 * @param low
 * @param high
 * @param segments
 */
const getRanges = (Type, low, high, segments = 3) => {
    //
};

/**
 * Expects JSON converted from CSV file
 * @param json
 */
module.exports = json => {

    const fieldDescriptions = new Map();

    const newDefinition = (fieldName) => {
        logger.trace(`newDefinition for ${fieldName}`);
        fieldDescriptions.set(fieldName, new Map());
        const map = fieldDescriptions.get(fieldName);
        map.set('fieldName', fieldName);
        map.set('allValues', new Map());
        map.set('valueRanges', new Map());
        map.set('typeHistory', []);
    };

    const addValue = (fieldName, value, type) => {
        logger.trace(`addValue for ${fieldName} - ${value}`);
        const map = fieldDescriptions.get(fieldName);

        if (map) {
            map.get('allValues').set(value, true);
            if (!map.get('typeHistory').includes(type)) {
                map.get('typeHistory').push(type);
            }

            // format ranges into a min and max :
            if (type === Date || type === Number) {
                const suffix = type === Date ? 'Date' : 'Number';
                const lowestKey = `lowest${suffix}`;
                const highestKey = `highest${suffix}`;
                const lowest = map.get(lowestKey);
                const highest = map.get(highestKey);

                if (value < lowest) {
                    map.set(lowestKey, value);
                } else if (value > highest) {
                    map.set(highestKey, value);
                }
            }

            return map;
        }

        logger.error(`could not find description for ${fieldName} - ${value}`)
    };

    json.forEach((obj, idx) => {
        Object.keys(obj).forEach(key => {
            if (idx === 0) {
                newDefinition(key)
            }

            const val = obj[key];
            const type = getType(val);
            addValue(key, val, type);
        });
    });

    for (let entry of fieldDescriptions.entries()) {

        const [fieldName, val] = entry;
        const typeHistory = val.get('typeHistory');

        let trueType = typeHistory[0];
        if (typeHistory.length > 1) {
            trueType = getTrueType(typeHistory);
        }

        val.set('trueType', trueType);

        if (trueType === Number || trueType === Date) {
            const suffix = trueType === Date ? 'Date' : 'Number';
            const lowestKey = `lowest${suffix}`;
            const highestKey = `highest${suffix}`;
            const lowest = map.get(lowestKey);
            const highest = map.get(highestKey);
            const ranges = getRanges(trueType, lowest, hieghest);
            // TODO ! assign ranges to values.
        } else if (trueType === String) {
            // TODO ! check the number of different strings! if it's relatively few, then proceed, otherwise, ignore.
        }
    }

    return fieldDescriptions;
};
