"use strict";


const SortedInputMap = require('../../lib/SortedInputMap');
const trainingData = require('../mocks/trainingData');
const attributeValues = trainingData.map(obj => {
    return obj.wordAttr;
});
const classificationVals = trainingData.map(obj => {
    return obj.enumAttr;
});
const attributeTest = (input, val) => input.wordAttr === val;
const classificationTest = (input, val) => input.enumAttr === val;


describe("SortedInputMap", () => {

    let si;
    beforeEach(() => {
        si = new SortedInputMap({trainingData, attributeValues, attributeTest, classificationVals, classificationTest});
    });

    it('should generate an instance of SortedInputMap', () => {
        expect(si instanceof SortedInputMap).toEqual(true);
        expect(si instanceof Map).toEqual(true);
    });

    it('should parse itself into a 2 tier map', () => {
        for (let attrMap of si.values()) {
            expect(attrMap instanceof Map).toEqual(true);
            expect(attrMap.get('categoryMap') instanceof Map).toEqual(true);
            expect(typeof attrMap.get('count') === 'number').toEqual(true);
            for (let classArr in attrMap.get('categoryMap')) {
                expect(classArr instanceof Array).toEqual(true);
            }
        }
    });

    describe('getTrainingData()', () => {

        it('should return an array', () => {
            expect(si.getTrainingData() instanceof Array).toEqual(true);
        });

        it('should return all of the training data passed in', () => {
            expect(si.getTrainingData().length).toEqual(trainingData.length);
            const allIds = si.getTrainingData().map(o => o.id).sort();
            expect(trainingData.map(o => o.id).sort()).toEqual(allIds);
        });
    });

    describe('getByAttributeAndCategory()', () => {
        it('should return inputs that match both the shit thing and the other shit thign.....', () => {});
    });
});
