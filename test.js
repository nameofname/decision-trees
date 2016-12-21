"use strict";

require('./babelHook');
const AttributesMap = require('./lib/AttributesMap');

const mock = require('./config/mockData');

const test = () => {
    mock()
        .then(data => {
            const {trainingData, attributes : attributeColumns} = data;
            const map = new AttributesMap({trainingData, attributeColumns});
            console.log(map);
        })
        .catch(err => {
            throw new Error(err);
        });
};

test();
