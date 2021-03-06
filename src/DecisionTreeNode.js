"use strict";

const assert = require('assert');
const informationGain = require('./informationGain');
const logger = require('./logger');

/**
 * Decision Tree Node shall have properties :
 *      - Children: Array of DCT Nodes
 *      - classAttribute : the attribute that we are trying to classify
 *      - branchAttribute : the attribute that it branches on to get children
 *      - trainingData: Array of training data objects in the current node
 *      - count: count of trainingData objects
 *      - parentCount: same from parent, for calculating probability
 *      - probability
 *      - entropy: from counts child nodes
 *      - conditionalEntropy: entropy of class data values within child nodes
 *      - IG: the information gained by branching on the branchAttribute
 *
 */
class DecisionTreeNode {

    constructor({ trainingData, parentCount, attributeList, classAttribute, branchAttrValue }) {

        assert(Array.isArray(trainingData), 'DecisionTreeNode: trainingData must be an array');
        assert(Number(parentCount) === parentCount, 'DecisionTreeNode: parentCount must be a number');
        assert(Array.isArray(attributeList), 'DecisionTreeNode: attributeList must be an array');
        assert(typeof classAttribute === 'string', 'DecisionTreeNode: classAttribute must be a string');

        this.trainingData = trainingData; // array of training data objects
        this.parentCount = parentCount; // count of training data in parent node
        this.attributeList = attributeList; // array of strings, field keys representing attributes on each TD object.
        this.classAttribute = classAttribute; // this is the attribute we create our classes based on.
        this.branchAttrValue = branchAttrValue; // this is the value this bucket was created from

        // the following are calculated after calculating information gain for each attribute in the attribute list.
        this.children = null;
        this.branchesOn = null; // the attribute that this node branches on.
        this.classValueCounts = new Map(); // counts for values of X (class attribute values) - used in calculating entropy
        // this.probability = null; // probability of being in this bucket with regards to parent // TODO ! needed?
        this.informationGain = null;
        this.conditionalEntropy = null;
        this.entropy = null;
    }

    /**
     * for each attribute :
     *      - create children
     *      - find IG of new children
     *      - if IG is higher than current, discard previous, and continue with current
     *      - repeat until done: the resulting children become our new children
     */
    branch() {
        const { classAttribute } = this;

        const bestFit = this.attributeList.reduce((prev, attribute) => {
            if (attribute === classAttribute) {
                return prev;
            }
            const children = this.createChildrenFromAttribute(attribute);
            const stats = this.findIgOfChildren(children);
            if (prev === undefined) {
                return { stats, children, attribute };
            } else {
                const prevIg = prev.stats.informationGain;
                return stats.informationGain > prevIg ? { stats, children, attribute } : prev;
            }
        }, undefined);

        const { entropy, conditionalEntropy, informationGain } = bestFit.stats;

        if (informationGain === 0 || informationGain === null) {
            this.children = []; // don't branch if there is no info to be gained
        } else {
            this.entropy = entropy;
            this.conditionalEntropy = conditionalEntropy;
            this.informationGain = informationGain;
            this.children = bestFit.children;
            this.branchesOn = bestFit.attribute;
            const logInfo = { informationGain, branchesOn: this.branchesOn };
            logger.trace(`DecisionTreeNode: branch - found ${JSON.stringify(logInfo)}`);
        }

        return this.children;
    }

    /**
     * Before we get the IG for a given attribute, we must know what children would look like for that attribute so
     * we can calculate entropy of this node, and the conditional entropy of the children.
     * This method creates the children of this node based on a given attribute. Once that is done we can calculate the
     * IG of that decision, and figure out if it's the best fit.
     */
    createChildrenFromAttribute(branchAttribute) {
        const { trainingData, classAttribute } = this;

        const children = trainingData.reduce((childMap, trainingObj) => {

            const {
                [branchAttribute]: branchAttrValue,
                [classAttribute]: classValue
            } = trainingObj;

            if (!childMap.get(branchAttrValue)) {
                childMap.set(branchAttrValue, new DecisionTreeNode({
                    trainingData: [],
                    parentCount: trainingData.length,
                    attributeList: this.attributeList.filter(name => name !== branchAttribute),
                    classAttribute,
                    branchAttrValue
                }));
            }

            // push training data object to child node
            const childNode = childMap.get(branchAttrValue);
            if (!Object.keys(trainingObj).includes(classAttribute)) {
                throw new Error(`DecisionTreeNode: invalid classAttribute passed : ${classAttribute}`);
            }
            childNode.trainingData.push(trainingObj);
            // increment counter for class value in child node class value counts
            const classValueCount = childNode.classValueCounts.get(classValue) || 0;
            childNode.classValueCounts.set(classValue, classValueCount + 1);

            return childMap;

        }, new Map());

        return children;
    }

    findIgOfChildren(proposedChildren) {
        return informationGain(proposedChildren, this.trainingData.length);
    }

    count() {
        return this.trainingData.length;
    }

    getClassStats() {
        let ret = {};

        if (this.branchAttrValue === undefined) {

            const classAttribute = this.classAttribute;
            this.trainingData.forEach(data => {
                const classValue = data[classAttribute];
                const classValueCount = this.classValueCounts.get(classValue) || 0;
                this.classValueCounts.set(classValue, classValueCount + 1);
            }, {});
        }

        for (let [key, value] of this.classValueCounts.entries()) {
            Object.assign(ret, { [key]: value });
        }

        return ret;
    }
}

module.exports = DecisionTreeNode;
