"use strict";

require('./babelHook');
// const AttributesMap = require('./lib/AttributesMap');
const SortedInputMap = require('./lib/SortedInputMap');
const mock = require('./config/mockData');
const trainingData = require('./__tests__/mocks/trainingData');
const attributes = require('./__tests__/mocks/attributes');
const attributeValues = trainingData.map(obj => {
    return obj.wordAttr;
});
const classificationVals = trainingData.map(obj => {
    return obj.enumAttr;
});
const attributeTest = (input, val) => input.wordAttr === val;
const classificationTest = (input, val) => input.enumAttr === val;


const si = new SortedInputMap({trainingData, attributeValues, attributeTest, classificationVals, classificationTest});
const test = () => {
    const out = si.getMergedTrainingData();
    console.log(out);
};

test();
