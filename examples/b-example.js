"use strict";


require('dotenv').config();
const createDecisionTree = require('../src/createDecisionTree');
const printTree = require('../src/printTree');
const logger = require('../src/logger');
const preProcess = require('../src/preProcess');
const json = require('../data/rptRonHackathon-100.json').result;
const json1000 = require('../data/rptRonHackathon-1000.json').result;


const trainingData = preProcess(json1000);
// logger.info(trainingData);

logger.info(
    printTree(
        createDecisionTree({
            trainingData,
            classAttribute: 'is_sold',
            ignoreAttributes: ['date_sold', 'is_unpublished', 'item_return_policy_id']
        }),
        ({ count, classStats}) => {
            const num = classStats && classStats['1'] || 0;
            const percent = Math.round((Number(num) / count) * 100);
            return `${percent}% sold`
        }
    )
);
