"use strict";


const colors = require('colors');


const printTree = (node, processFunc = () => {}, currLevel = 0) => {

    const indent = new Array(currLevel).fill('|  ').join('');
    const { branchesOn, branchAttrValue, informationGain } = node;
    const classStats = node.getClassStats();
    const classStatsString = JSON.stringify(classStats);
    const count = node.count();
    const customOutput = processFunc({ count, classStats});
    let line;

    if (!branchesOn) {
        line = `${indent}├── Leaf Node : BranchValue (${branchAttrValue}) Count (${count}) Results (${classStatsString}}) (${customOutput})`;
    } else {
        line = `${indent}├── BranchValue (${branchAttrValue}) Branch On : ${branchesOn} IG (${colors.yellow(informationGain)}) Count (${count}) Results (${classStatsString}) (${customOutput})`;
    }

    console.log(colors.green(line));

    node.children && node.children.forEach(child => {
        printTree(child, processFunc, (currLevel + 1));
    });

};

module.exports = printTree;

