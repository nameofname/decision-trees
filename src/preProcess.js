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
        if (typeHistory.length > 1) {
            console.log('------------------------------------------------')
            console.log(fieldName, typeHistory, '==>', getTrueType(typeHistory));
        }

    }

    return fieldDescriptions;
};
