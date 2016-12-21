"use strict";


/**
 * Attributes map is a store of attributes.
 * It takes 2 arguments :
 *      - trainingData <array> of objects - each object has attributes we will use in sorting
 *      - attributeColumns <array> of objects - each object describes the row in the DB
 * A query to generate trainginData might look like :
 *      - SELECT * FROM users WHERE createdYear < 1995;
 * A query to generate attributeColumns might looks like :
 *      - SHOW COLUMNS FROM users;
 */
class AttributesMap extends Map {

    constructor({trainingData, attributeColumns}) {
        super();
        if (!this.validate(trainingData, attributeColumns)) {
            throw new Error('trainingData must be an Array, attributeColumns must be string');
        }
        privateAttributeColumns.set(this, attributeColumns);
        privateTrainingData.set(this, trainingData);
        this.parse();
    }

    // TODO - needed? perhaps not.
    // getValuesFor(key) {
    //     return this.get(key).values;
    // }
    //
    // getTestFor(key) {
    //     return this.get(key).test;
    // }

    validate(trainingData, attributeColumns) {
        let ret = true;
        if (!(trainingData instanceof Array) || !(attributeColumns instanceof Array)) {
            return false;
        }
        [trainingData, attributeColumns].forEach(arr => {
            arr.forEach(obj => {
                if (!(obj instanceof Object)) {
                    ret = false;
                }
            });
        });
        return ret;
    }

    parse() {
        const trainingData = privateAttributeColumns.get(this);
        privateAttributeColumns.get(this).forEach(attr => {
            const attributeName = attr.Field;
            const attrType = attr.Type.split('(')[0];
            let type;

            if (numberTypes.includes(attrType)) {
                type = 'number';
            } else if (wordTypes.includes(attrType)) {
                type = 'word';
            } else if (attrType === 'timestamp') {
                type = 'date';
            } else if (attrType === 'enum') {
                type = 'enum';
            } else {
                throw Error('An unrecognized data type showed up. Sharks.');
                return;
            }

            const possibleValues = trainingData.reduce((outputArr, input) => {
                if (outputArr.indexOf(input[attributeName]) === -1) {
                    outputArr.push(input[attributeName]);
                }
                return outputArr;
            }, []);

            // find attribute values and test functions for every attribute.
            let valuesAndTest;
            if (type === 'number' || type === 'date') {
                valuesAndTest = _getNumRangesAndTestFn(attributeName, possibleValues);
            } else if (type === 'word') {
                valuesAndTest = _getWordValuesAndTestFn(attributeName, possibleValues);
            } else if (type === 'enum') {
                valuesAndTest = {
                    values: possibleValues,
                    test: (input, value) => input[attributeName] === value
                };
            }

            // ignore any attribute marked as { ignore : true }
            if (!valuesAndTest.ignore) {
                const obj = Object.assign({}, {
                    type,
                    attributeName
                }, valuesAndTest);

                this.set(attributeName, obj)
            }
        });
    }
}


// Private helper functions an constants used in parsing attributes map
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

const numberTypes = ['int', 'decimal', 'bigint', 'float', 'float unsigned', 'tinyint'];
const wordTypes = ['varchar', 'tinytext', 'text', 'mediumtext'];
const ATTRIBUTE_NUM_CUTOFF = 20;
// use WeakMaps for storing private variables :
const privateAttributeColumns = new WeakMap();
const privateTrainingData = new WeakMap();


const _getNumRangesAndTestFn = (fieldName, possibleValues) => {
    // if there are fewer than N numbers in the list, it's easy enough to branch on those specific attribute values :
    if (possibleValues.length < ATTRIBUTE_NUM_CUTOFF) {
        return {
            values: possibleValues,
            test: (input, val) => {
                return (input[fieldName] === val);
            }
        };
    }

    // else we must calculate numeric ranges and create test functions for those ranges :
    const values = [];
    const sorted = possibleValues.sort();
    const lowest = sorted[0];
    const highest = sorted[sorted.length - 1];
    const range = highest - lowest;
    const tenth = range * 0.1;

    for (var i = 0; i < ATTRIBUTE_NUM_CUTOFF; i++) {
        const lowerBound = lowest + (i * tenth);
        const upperBound = lowest + ((i + 1) * tenth);
        values.push([lowerBound, upperBound]);
    }

    return {
        values,
        range: true,
        test: (input, range) => {
            return (input[fieldName] > range[0] && input[fieldName] <= range[1]);
        }
    };
};

const _getWordValuesAndTestFn = (fieldName, possibleValues) => {
    if (possibleValues.length < ATTRIBUTE_NUM_CUTOFF) {
        return {
            values: possibleValues,
            test: (input, val) => input[fieldName] === val
        };
    }
    // if this is a text input field with more than 50 values we don't want to index on it
    // ... unless I think of a smart way to do that in the future.
    return {
        ignore : true
    };
};


module.exports = AttributesMap;
