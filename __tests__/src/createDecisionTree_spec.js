"use strict";


const createDecisionTree = require('../../src/createDecisionTree');
const DecisionTreeNode = require('../../src/DecisionTreeNode');
// const trainingData = require('../mocks/trainingData');
const trainingDataCollegeMajor = require('../mocks/trainingDataCollegeMajor');


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
        // console.log(tree);
        expect(tree instanceof DecisionTreeNode).toEqual(true);
    });

    it('should populate the children of tree with the best fit attribute', () => {
        createTree();
        ['Math', 'CS', 'History'].forEach(name => {
            expect(tree.children.get(name) instanceof DecisionTreeNode).toEqual(true);
        });
    });

});

