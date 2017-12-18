"use strict";


const createDecisionTree = require('../../src/createDecisionTree');
const DecisionTreeNode = require('../../src/DecisionTreeNode');
const trainingData = require('../../mocks/trainingData');
const trainingDataCollegeMajor = require('../../mocks/trainingDataCollegeMajor');
const logger = require('../logger');
const printTree = require('../printTree');


describe.only('createDecisionTree', ()=> {

    let tree;
    const createTree = (trainingData = trainingDataCollegeMajor) => {
        tree = createDecisionTree({
            trainingData,
            classAttribute: 'likes'
        });
    };

    it('should return the root node of your tree', () => {
        createTree();
        expect(tree instanceof DecisionTreeNode).toEqual(true);
    });

    it('should populate the children of tree with the best fit attribute', () => {
        createTree();
        ['Math', 'CS', 'History'].forEach(name => {
            expect(tree.children.get(name) instanceof DecisionTreeNode).toEqual(true);
        });
    });

    it('should build a multi-level tree for training data with many attributes', () => {
        // createTree(trainingData);
        logger.info(printTree(tree));
    });

});

