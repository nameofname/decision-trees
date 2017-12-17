"use strict";


const DecisionTreeNode = require('../../src/DecisionTreeNode');
const trainingData = require('../mocks/trainingData');
const attributeList = Object.keys(trainingData[0]);


describe.only('DecisionTreeNode', ()=> {

    let node;
    const createNode = () => {
        node = new DecisionTreeNode({ trainingData, parentCount: trainingData.length, attributeList })
    };

    it('should return an insance of DecisionTreeNode', () => {
        createNode();
        expect(node instanceof DecisionTreeNode).toEqual(true);
    });

    it('should throw an error if params missing', () => {
        expect(() => {
            return new DecisionTreeNode({ trainingData })
        }).toThrow();
    });

    it('should initialize with the correct properties set to null', () => {
        createNode();
        expect(node.branchAttribute).toEqual(null);
        expect(node.informationGain).toEqual(null);
        expect(node.conditionalEntropy).toEqual(null);
        expect(node.entropy).toEqual(null);
    });

});

