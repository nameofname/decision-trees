"use strict";


const informationGain = require('../../src/informationGain');
const trainingData = require('../mocks/trainingData');

// const wordsArr = trainingData.reduce((arr, { wordAttr }) => {
//     return arr.includes(wordAttr) ? arr : [wordAttr, ...arr];
// }, []);
// const attributeColumns = require('../mocks/attributes');
// console.log('all the words!!!!! ', wordsArr)
// const testFunctions = {
//     name : val => Math.random(), // TODO ? how to evaulte something that's always different?
//     intAttr : val => val, // always 1 or2
//     enumAttr : val => (val === 'Y' ? 1 : 2),
//     wordAttr : val => wordsArr.indexOf(val) + 1 // 1-based index of word in words array
// };


describe('buildAttributesMap', ()=> {

    it('calculate a high IG for enumAttr and intAttr', () => {
        console.log(informationGain(trainingData, 'intAttr', 'enumAttr'));
        // expect(informationGain(trainingData, 'intAttr', 'enumAttr')).toEqual(0.5);
    });

    // it('calculate a lower IG for enumAttr and wordAttr', () => {
    //     expect(informationGain(trainingData, 'intAttr', 'wordAttr')).toEqual(0.3);
    // });

});

