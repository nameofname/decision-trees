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

    rootNode.branch();
    console.log('????????????????????', rootNode.children);

    // rootNode.children.forEach((child, key) => {
    //     console.log('===================', key);
    //     console.log(child)
    // });

    return rootNode;
};
