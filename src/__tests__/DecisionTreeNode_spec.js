"use strict";


const DecisionTreeNode = require('../../src/DecisionTreeNode');
const trainingData = require('../../mocks/trainingData');
const trainingDataCollegeMajor = require('../../mocks/trainingDataCollegeMajor');
const attributeList = Object.keys(trainingData[0]);
const collegeAttributeList = Object.keys(trainingDataCollegeMajor[0]);


describe('DecisionTreeNode', ()=> {

    let node;
    const createNode = () => {
        node = new DecisionTreeNode({
            trainingData,
            parentCount: trainingData.length,
            attributeList,
            classAttribute: 'enumAttr'
        });
    };
    const createCollegeNode = () => {
        node = new DecisionTreeNode({
            trainingData: trainingDataCollegeMajor,
            parentCount: trainingDataCollegeMajor.length,
            attributeList: collegeAttributeList,
            classAttribute: 'likes'
        });
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
        expect(node.branchesOn).toEqual(null);
        expect(node.informationGain).toEqual(null);
        expect(node.conditionalEntropy).toEqual(null);
        expect(node.entropy).toEqual(null);
    });

    describe('createChildrenFromAttribute', () => {

        beforeEach(createCollegeNode);

        it('should return a Map', () => {
            expect(node.createChildrenFromAttribute('major') instanceof Map).toEqual(true);
        });

        it('should correctly segment our data', () => {
            const childMap = node.createChildrenFromAttribute('major');
            expect(childMap.get('Math').trainingData.length).toEqual(4);
            expect(childMap.get('CS').trainingData.length).toEqual(2);
            expect(childMap.get('History').trainingData.length).toEqual(2);
        });

        it('should count different values for class attribute while building list ', () => {
            const childMap = node.createChildrenFromAttribute('major');
            expect(childMap.get('Math').classValueCounts.get(true)).toEqual(2);
            expect(childMap.get('Math').classValueCounts.get(false)).toEqual(2);
            expect(childMap.get('CS').classValueCounts.get(true)).toEqual(2);
            expect(childMap.get('CS').classValueCounts.get(false)).toEqual(undefined);
            expect(childMap.get('History').classValueCounts.get(true)).toEqual(undefined);
            expect(childMap.get('History').classValueCounts.get(false)).toEqual(2);
        });

    });

    describe('findIgOfChildren', () => {

        beforeEach(createCollegeNode);

        it('should calculate correct entropy, conditionalEntropy and informationGain for college training data', () => {
            const childMap = node.createChildrenFromAttribute('major');
            const result = node.findIgOfChildren(childMap);
            expect(result).toEqual({ entropy: 1, conditionalEntropy: 0.5, informationGain: 0.5 });
        });

    });

    describe('branch', () => {

        beforeEach(createCollegeNode);

        it('should return a map of children', () => {
            const result = node.branch();
            expect(result instanceof Map).toEqual(true);
            expect(result).toEqual(node.children);
        });

        it('should branch on major field for college training data, because that\'s the only field', () => {
            node.branch();
            expect(node.children.get('Math') instanceof DecisionTreeNode).toEqual(true);
            expect(node.children.get('Math').count()).toEqual(4);
            expect(node.children.get('CS') instanceof DecisionTreeNode).toEqual(true);
            expect(node.children.get('CS').count()).toEqual(2);
            expect(node.children.get('History') instanceof DecisionTreeNode).toEqual(true);
            expect(node.children.get('History').count()).toEqual(2);
            expect(node.entropy).toEqual(1);
            expect(node.conditionalEntropy).toEqual(0.5);
            expect(node.informationGain).toEqual(0.5);
        });

    });

});

