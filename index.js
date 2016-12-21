"use strict";


require('./babelHook');
require('babel-polyfill');

const mockData = require('./config/mockData');
const decisionTree = require('./lib/decisionTreeBuilder');


decisionTree(mockData);
