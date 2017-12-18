"use strict";

// TODO ! I don't need any of the babel deps any more. ... unless I want to start using import.
// require('./babelHook');
// const AttributesMap = require('./src/AttributesMap');
const SortedInputMap = require('./SortedInputMap');
const mock = require('./../config/mockData');
const trainingData = require('./../__tests__/mocks/trainingData');
const attributes = require('./../__tests__/mocks/attributes');
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
