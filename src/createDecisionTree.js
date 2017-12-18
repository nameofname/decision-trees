"use strict";

const DecisionTreeNode = require('./DecisionTreeNode');


module.exports = ({classAttribute, trainingData}) => {
    const attributeList = Object.keys(trainingData[0]);
    const rootNode = new DecisionTreeNode({
        trainingData,
        classAttribute,
        attributeList,
        parentCount: trainingData.length
    });

    // TODO ! recurse.
    return rootNode;
};
