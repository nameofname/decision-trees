"use strict";


require('dotenv').config();
const path = require('path');
const csv = require('csvtojson');
const trainingData = require('./mocks/trainingData');
const trainingDataCollegeMajor = require('./mocks/trainingDataCollegeMajor');
const createDecisionTree = require('./src/createDecisionTree');
const printTree = require('./src/printTree');
const logger = require('./src/logger');
const preProcess = require('./src/preProcess');


const dataPath = path.join(__dirname, 'data/item-reporting-small.csv');
let done = false;
let json = [];


const makeTree = () => {
    logger.info(printTree(
        createDecisionTree({
            trainingData: json,
            classAttribute: 'is_sold',
            // ignoreAttributes: ['id', 'name']
        })
    ));
};

csv()
    .fromFile(dataPath)
    .on('json', j => {
        // if (json.length > 99) {
        //     logger.info('Lets make this tree');
        //     makeTree();
        //     logger.info('We have made a tree');
        // } else {
        //     json.push(j);
        // }
        json.push(j);
    })
    .on('done', error => {
        if (error) {
            logger.error(error);
            process.exit(1);
        }
        logger.info('completed parsing CSV file', json[0]);
        logger.info(preProcess(json));
    });

