"use strict";


const AttributeProperties = require('../.././AttributeProperties');
const trainingData = require('.././mocks/trainingData');
const attributeColumns = require('.././mocks/attributes');
const numberTypes = ['int', 'decimal', 'bigint', 'float', 'float unsigned', 'tinyint'];
const wordTypes = ['varchar', 'tinytext', 'text', 'mediumtext'];

describe('buildAttributesMap', ()=> {

    let atp;
    beforeEach(() => {
        atp = new AttributeProperties({trainingData, attributeColumns});
    });

    it('should be instantiated as a new instance of AttributeProperties class', () => {
        expect(atp instanceof Map).toEqual(true);
        expect(atp instanceof AttributeProperties).toEqual(true);
    });

    it('should blow up if you pass bad init data', () => {
        expect(() => {
            new AttributeProperties({
                trainingData: [{array: 'of'}, {correct: 'data'}, {types: 'bitch'}],
                attributeColumns: ['array', 'of', ['wrong'], [{data: 'types'}]]
            });
        }).toThrow();
    });

    it('should calculate all of the possible values of each attribute column from the training data', () => {
        expect(atp.get('enumAttr').values).toEqual(['Y', 'N']);
        expect(atp.get('wordAttr').values).toEqual(['ronald', 'manface', 'shirt']);
    });

    it('should generate range values for numeric input with more than N possible values', () => {
        const training = trainingData.slice();
        while (training.length < 200) {
            training.push({
                id : training.length,
                name : `mock ${training.length}`,
                intAttr : training.length,
                enumAttr : 'Y',
                wordAttr : 'manface'
            });
        }
        const atp1 = new AttributeProperties({trainingData: training, attributeColumns});
        expect(atp1.get('intAttr').range).toEqual(true);
        expect(atp1.get('intAttr').values.length).toEqual(atp1.numericRangeCutoff);
        atp1.get('intAttr').values.forEach(arr => {
            expect(arr instanceof Array).toEqual(true);
            expect(arr.length).toEqual(2);
        })
    });

    it('should correctly classify numeric columns as numbers and words as words', () => {
        let numbersFound = 0;
        let wordsFound = 0;
        attributeColumns.forEach(obj => {
            if (numberTypes.includes(obj.Type.split('(')[0])) {
                expect(atp.get(obj.Field).type).toEqual('number');
                numbersFound++;
            } else if (wordTypes.includes(obj.Type.split('(')[0])) {
                expect(atp.get(obj.Field).type).toEqual('word');
                wordsFound++;
            }
        });
        expect(numbersFound).toEqual(11);
        expect(wordsFound).toEqual(7);
    });

});
