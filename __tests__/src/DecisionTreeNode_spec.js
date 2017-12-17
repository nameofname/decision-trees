"use strict";


const DecisionTreeNode = require('../../src/DecisionTreeNode');
const trainingData = require('../mocks/trainingData');
const trainingDataCollegeMajor = require('../mocks/trainingDataCollegeMajor');
const attributeList = Object.keys(trainingData[0]);
const collegeAttributeList = Object.keys(trainingDataCollegeMajor[0]);


describe.only('DecisionTreeNode', ()=> {

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
        expect(node.branchAttribute).toEqual(null);
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
            console.log(childMap)
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

        it('should return something', () => {
            const childMap = node.createChildrenFromAttribute('major');
            const result = node.findIgOfChildren(childMap);
            console.log(result);
            expect(false).toEqual(true);
        });

    });

});

