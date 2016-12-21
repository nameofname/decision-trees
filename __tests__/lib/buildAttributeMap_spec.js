"use strict";


const buildAttributeMap = require('../../lib/buildAttributeMap');
const trainingData = require('../mocks/trainingData');
const attributes = require('../mocks/attributes');

describe('buildAttributesMap', ()=> {
    it('should run 1 test', () => {
        const out = buildAttributeMap(trainingData, attributes);
        expect(out instanceof Map).toEqual(true);
    })
});
