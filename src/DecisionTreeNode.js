"use strict";

const informationGain = require('./informationGain');
const assert = require('assert');

/**
 * Decision Tree Node shall have properties :
 *      - Children: Array of DCT Nodes
 *      - branchAttribute : the attribute that it branches on to get children
 *      - trainingData: Array of training data objects in the current node
 *      - count: count of trainingData objects
 *      - parentCount: same from parent, for calculating probability
 *      - probability
 *      - entropy: from counts child nodes
 *      - conditionalEntropy: entropy of classification data values within child nodes
 *      - IG: the information gained by branching on the branchAttribute
 *
 */
class DecisionTreeNode {

    constructor({ trainingData, parentCount, attributeList }) {

        assert(Array.isArray(trainingData), 'DecisionTreeNode: trainingData must be an array');
        assert(Number(parentCount) === parentCount, 'DecisionTreeNode: parentCount must be an number');
        assert(Array.isArray(attributeList), 'DecisionTreeNode: attributeList must be an array');

        this.trainingData = trainingData; // array of training data objects
        this.parentCount = parentCount; // count of training data in parent node
        this.attributeList = attributeList; // array of strings, field keys representing attributes on each TD object.

        // the following are calculated after calculating information gain for each attribute in the attribute list.
        this.branchAttribute = null;
        this.informationGain = null;
        this.conditionalEntropy = null;
        this.entropy = null;
    }

    createDataMap (trainingData, categoryField, igField) {
        // for each piece of training data, we want to calculate the probability that the igField will be a certain value
        // and connect that to our category field to find the relationship between the two.
        // to that end we start by building out a map of IG values to category values.
        // the structure looks like this :
        // Map {
        //      igValue1: Map {
        //          count : <number>,
        //          categoryValue1: <number>,
        //          categoryValue2: <number>,
        //          ....
        //      },
        //      igValue2: Map { ... },
        //      ...
        // }
        //
        // what this tells us is the number of times each category input is associated with each ig input value we are
        // testing for
        // in this scenario, each igValue in the map represents a potential child node - and if we decide to branch
        // on that child node, the counts of each will become the node in question.
        // basically each node should be a data map with a set of training data within itself !!!! and it should have a method
        // to sub-divide based on a given ig field and category field.
        // the IG function should be purely mathematical, this should be a part of the node.
        const dataMap = trainingData.reduce((map, obj) => {
            const { [categoryField]: catValue, [igField]: igValue } = obj;
            if (!map.get(igValue)) {
                map.set(igValue, new Map());
                map.get(igValue).set(COUNT, 0);
            }

            const igMap = map.get(igValue);
            igMap.set(COUNT, igMap.get(COUNT) + 1);

            if (!igMap.get(catValue)) {
                igMap.set(catValue, 1);
            } else {
                igMap.set(catValue, (igMap.get(catValue) + 1));
            }

            return map;
        }, new Map());

        return { dataMap };
    };

}

module.exports = DecisionTreeNode;
