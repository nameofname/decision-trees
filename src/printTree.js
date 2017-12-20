"use strict";


const colors = require('colors');


const printTree = (node, currLevel = 0) => {

    const indent = new Array(currLevel).fill('|  ').join('');
    const { branchesOn, branchAttrValue, informationGain } = node;
    const classStats = JSON.stringify(node.getClassStats());
    let line;

    if (!branchesOn) {
        line = `${indent}├── Leaf Node : BranchValue (${branchAttrValue}) Count (${node.count()}) Results (${classStats}})`;
    } else {
        line = `${indent}├── BranchValue (${branchAttrValue}) Branch On : ${branchesOn} IG (${colors.yellow(informationGain)}) Count (${node.count()}) Results (${classStats})`;
    }

    console.log(colors.green(line));

    node.children && node.children.forEach(child => {
        printTree(child, (currLevel + 1));
    });

};

module.exports = printTree;

