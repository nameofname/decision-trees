"use strict";


const DecisionTreeNode = require('../../src/DecisionTreeNode');
const trainingData = require('../mocks/trainingData');


describe('DecisionTreeNode', ()=> {

    it('should return an insance of DecisionTreeNode', () => {
        const node = new DecisionTreeNode({ trainingData });
        expect(node instanceof DecisionTreeNode).toEqual(true);
    });

    it('should initialize with the correct properties set to null', () => {
        expect(false).toEqual(true);
    });

});

