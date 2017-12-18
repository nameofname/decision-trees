"use strict";

const DecisionTreeNode = require('./DecisionTreeNode');
const logger = require('./logger');

const doBranching = node => {
    logger.trace(`RECURSION:doBranching`);
    const availableAttributes = node.attributeList.filter(n => n !== node.classAttribute);

    if (!availableAttributes.length) {
        return;
    }

    const children = node.branch();
    children.forEach((child, key) => {
        logger.trace(`RECURSION:doBranching branching child of ${key}`);
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
