"use strict";

const DecisionTreeNode = require('./DecisionTreeNode');

const doBranching = node => {
    const children = node.branch();
    const availableAttributes = node.attributeList.filter(n => n !== node.classAttribute);

    if (!availableAttributes.length) {
        return;
    }

    children.forEach((child, key) => {
        console.log(`branching on ${key}`);
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
