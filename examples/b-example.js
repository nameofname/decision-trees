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


const trainingData = preProcess(json);
logger.info(
    printTree(
        createDecisionTree({
            trainingData,
            classAttribute: 'is_sold'
        })
    )
);