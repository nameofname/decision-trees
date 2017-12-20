"use strict";


require('dotenv').config();
const createDecisionTree = require('../src/createDecisionTree');
const printTree = require('../src/printTree');
const logger = require('../src/logger');
const preProcess = require('../src/preProcess');
const json = require('../data/rptRonHackathon-100.json').result;

const makeTree = () => {
    logger.info(printTree(
        createDecisionTree({
            trainingData: json,
            classAttribute: 'is_sold',
            // ignoreAttributes: ['id', 'name']
        })
    ));
};


// let n = 0;
// setInterval(() => {
//     console.log(json[n]);
//     ++n;
// }, 2000)


// preProcess(json);
logger.info(preProcess(json));