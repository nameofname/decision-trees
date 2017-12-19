"use strict";


const createDecisionTree = require('../../src/createDecisionTree');
const DecisionTreeNode = require('../../src/DecisionTreeNode');
const trainingData = require('../../mocks/trainingData');
const trainingDataCollegeMajor = require('../../mocks/trainingDataCollegeMajor');
const logger = require('../logger');
const printTree = require('../printTree');


describe.only('createDecisionTree', ()=> {

    let tree;
    const createTree = (trainingData = trainingDataCollegeMajor, classAttribute = 'likes') => {
        tree = createDecisionTree({
            trainingData,
            classAttribute
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
        tree = createDecisionTree({
            trainingData,
            classAttribute: 'intAttr'
        });
        expect(tree.children.get(1).children.get('one') instanceof DecisionTreeNode).toEqual(true);
        // note - in this case we should have a very ineffective tree, because we didn't ignore attributes that don't
        // tell us much
        expect(tree.branchesOn).toEqual('id');
        expect(tree.children.get(1).branchesOn).toEqual('name');
        expect(tree.children.get(1).children.get('one').branchesOn).toEqual('enumAttr');
    });

    it('should not branch on attributes in the ignoreAttributes argument', () => {
        tree = createDecisionTree({
            trainingData,
            classAttribute: 'intAttr',
            ignoreAttributes: ['id', 'name']
        });
        logger.info(printTree(tree));
        expect(tree.branchesOn).toEqual('enumAttr');
        expect(tree.children.get('Y').children.get('one').branchesOn).toEqual('wordAttr');
    });

});

