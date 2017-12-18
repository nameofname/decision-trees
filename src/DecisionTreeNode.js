"use strict";

const assert = require('assert');
const informationGain = require('./informationGain');

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

    constructor({ trainingData, parentCount, attributeList, classAttribute }) {

        assert(Array.isArray(trainingData), 'DecisionTreeNode: trainingData must be an array');
        assert(Number(parentCount) === parentCount, 'DecisionTreeNode: parentCount must be a number');
        assert(Array.isArray(attributeList), 'DecisionTreeNode: attributeList must be an array');
        assert(typeof classAttribute === 'string', 'DecisionTreeNode: classAttribute must be a string');

        this.trainingData = trainingData; // array of training data objects
        this.parentCount = parentCount; // count of training data in parent node
        this.attributeList = attributeList; // array of strings, field keys representing attributes on each TD object.
        this.classAttribute = classAttribute; // this is the attribute we create our classes based on.

        // the following are calculated after calculating information gain for each attribute in the attribute list.
        this.children = null;
        this.branchAttribute = null;
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
                return { stats, children };
            } else {
                const prevIg = prev.stats.informationGain;
                return stats.informationGain > prevIg ? { stats, children } : prev;
            }
        }, undefined);

        if (bestFit === undefined) {
            // in this case, there were no more attributes to branch on
            return undefined;
        }

        const { entropy, conditionalEntropy, informationGain } = bestFit.stats;
        this.entropy = entropy;
        this.conditionalEntropy = conditionalEntropy;
        this.informationGain = informationGain;

        this.children = bestFit.children;
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
        console.log(`trying to createChildrenFromAttribute ${branchAttribute}`);

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
                    classAttribute
                }));
            }

            // push training data object to child node
            const childNode = childMap.get(branchAttrValue);
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
}

module.exports = DecisionTreeNode;
