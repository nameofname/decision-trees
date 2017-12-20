"use strict";


const colors = require('colors');


const printTree = (node, currLevel = 0) => {

    const indent = new Array(currLevel).fill('|  ').join('');
    const { branchesOn, classAttribute, branchAttrValue, informationGain } = node;
    let classResults;
    let line;

    if (!branchesOn) {
        classResults = node.trainingData.reduce((p, o) => {
            const val = o[classAttribute].toString();
            if (!p[val]) {
                p[val] = 0;
            }
            ++p[val];
            return p;
        }, {});
        line = `${indent}├── Leaf Node : BranchValue (${branchAttrValue}) Count (${node.count()}) Results (${JSON.stringify(classResults)})`;

    } else {
        line = `${indent}├── Branched On : ${branchesOn} IG (${colors.yellow(informationGain)}) BranchValue (${branchAttrValue}) Count (${node.count()})`;
    }


    console.log(colors.green(line));

    node.children && node.children.forEach(child => {
        printTree(child, (currLevel + 1));
    });

};

module.exports = printTree;

