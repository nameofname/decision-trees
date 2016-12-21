"use strict";


const AttributeProperties = require('../../lib/AttributeProperties');
const trainingData = require('../mocks/trainingData');
const attributeColumns = require('../mocks/attributes');

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
        console.log('wat will we find.', atp.get('enumAttr').values)
        expect(atp.get('enumAttr').values).toEqual(['Y', 'N']);
    });

    // it('should correctly parse the attributes', () => {
    //     attributeColumns.forEach(obj => {
    //         expect(atp.get(obj.Field) instanceof Object).toEqual(true)
    //         expect(atp.get(obj.Field).value instanceof Array).toEqual(true)
    //         expect(atp.get(obj.Field).test instanceof Function).toEqual(true)
    //     });
    // });
});
