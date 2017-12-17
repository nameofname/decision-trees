"use strict";

const assert = require('assert');

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
 *      - conditionalEntropy: entropy of classification data values within child nodes
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
        this.branchAttribute = null;
        this.informationGain = null;
        this.conditionalEntropy = null;
        this.entropy = null;
    }

    branch () {
        // for each attribute :
        // create children
        // pass those children to IG method
        // if IG is higher than current, re-assign children to proposed children
        // repeat until done.
    }

    /**
     * Before we get the IG for a given attribute, we must know what children would look like for that attribute so
     * we can calculate entropy of this node, and the conditional entropy of the children.
     * This method creates the children of this node based on a given attribute. Once that is done we can calculate the
     * IG of that decision, and figure out if it's the best fit.
     */
    createChildrenFromAttribute (branchAttribute) {
        const { trainingData, classAttribute } = this;

        const children = trainingData.reduce((childMap, trainingObj) => {

            const { [branchAttribute]: branchAttrValue } = trainingObj;
            if (!childMap.get(branchAttrValue)) {
                childMap.set(branchAttrValue, new DecisionTreeNode({
                    trainingData: [],
                    parentCount: trainingData.length,
                    attributeList: this.attributeList.filter(name => name !== branchAttribute),
                    classAttribute
                }));
            }

            childMap.get(branchAttrValue).trainingData.push(trainingObj);
            return childMap;

        }, new Map());

        return children;
    };

    findIgOfChildren (proposedChildren) {
        // helper to branch method
    }

}

module.exports = DecisionTreeNode;
