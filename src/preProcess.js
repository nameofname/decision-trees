"use strict";


const moment = require('moment');
const logger = require('./logger');

const isDate = date => moment(date).isValid();
const isNumber = num => Number(num).toString() === num.toString();
const isString = str => true;
const isNull = n => n === null;
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
        case isDate(value) :
            return Date;
        case isNumber(value) :
            return Number;
        case isBool(value) :
            return Boolean;
        case isNull(value) :
            return null;
        case isUndefined(value) :
            return undefined;
        case isString(value) :
            return Number;
        default :
            logger.error('unable to find type for :', value);
            return undefined;
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
        map.set('allValues', new Map());
        map.set('valueRanges', new Map());
        map.set('typeHistory', []);
    };

    const addValue = (fieldName, value, type) => {
        logger.trace(`addValue for ${fieldName} - ${value}`);
        const map = fieldDescriptions.get(fieldName);
        if (!map) {
            logger.error(`could not find description for ${fieldName} - ${value}`)
        } else {
            map.get('allValues').set(value, true);
            if (!map.get('typeHistory').includes(type)) {
                map.get('typeHistory').push(type);
            }
        }
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

    return fieldDescriptions;
};
