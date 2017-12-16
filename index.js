"use strict";


require('./babelHook');
require('babel-polyfill');

const mockData = require('./config/mockData');
const decisionTree = require('./src/decisionTreeBuilder');


decisionTree(mockData)
    .then(tree => {
        console.log('Received this decision tree : ');
        console.log(tree);
    })
    .catch(err => {
        console.log('Error caught : ', err);
    });
