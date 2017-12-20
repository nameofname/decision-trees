"use strict";


const colors = require('colors');


const printTree = (node, currLevel = 0) => {

    const indent = new Array(currLevel).fill('|  ').join('');
    const { branchesOn, branchAttrValue, informationGain } = node;

    let line;
    if (!branchesOn) {
        line = `${indent}├── Leaf Node : BranchValue (${branchAttrValue}) Count (${node.count()}) Results (${JSON.stringify(node.getClassStats())}})`;
    } else {
        line = `${indent}├── Branched On : ${branchesOn} IG (${colors.yellow(informationGain)}) BranchValue (${branchAttrValue}) Count (${node.count()})`;
    }

    console.log(colors.green(line));

    node.children && node.children.forEach(child => {
        printTree(child, (currLevel + 1));
    });

};

module.exports = printTree;

