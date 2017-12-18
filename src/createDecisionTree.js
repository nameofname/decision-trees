"use strict";

const DecisionTreeNode = require('./DecisionTreeNode');

const doBranching = node => {
    console.log(`do branching recur ...`);
    const availableAttributes = node.attributeList.filter(n => n !== node.classAttribute);

    if (!availableAttributes.length) {
        return;
    }

    const children = node.branch();
    children.forEach((child, key) => {
        console.log(`branching child of ${key}`);
        return doBranching(child);
    });

    return node;
};

module.exports = ({classAttribute, trainingData}) => {
    const attributeList = Object.keys(trainingData[0]);
    const rootNode = new DecisionTreeNode({
        trainingData,
        classAttribute,
        attributeList,
        parentCount: trainingData.length
    });

    return doBranching(rootNode);
};
