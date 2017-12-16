"use strict";

// const SortedInputMap = require('./SortedInputMap');
const COUNT = '__________________COUNT__';

// probability (used in entropy)
const _probability = (val, total) => (val / total);
// entropy iterator is a single step in calculating entropy of a series
const _entropyIterator = (val, total) => (_probability(val, total) * Math.log2(_probability(val, total)));
// get the entropy for a single series :
// to calculate entropy, for each probability in series multiply by log2(probability) - subtract the result from prev
const entropyForSeries = (catMap, total) => {
    let out = 0;
    for (let arr of catMap.values()) {
        out -= _entropyIterator(arr.length, total);
    }
    return out;
};


// TODO ! we are going to ignore the testFunctions for now and assume we can do this just by detecting probability of value X for igField

/**
 * Calculate the information gain for a given field to another field
 */
module.exports = (trainingData, categoryField, igField) => {

    let ig = 1;

    // for each piece of training data, we want to calculate the probability that the igField will be a certain value
    // and connect that to our category field to find the relationship between the two.
    // to that end we start by building out a map of IG values to category values.
    // the structure looks like this :
    // Map {
    //      igValue1: Map {
    //          count : <number>,
    //          categoryValue1: <number>,
    //          categoryValue2: <number>,
    //          ....
    //      },
    //      igValue2: Map { ... },
    //      ...
    // }
    //
    // what this tells us is the number of times each category input is associated with each ig input value we are
    // testing for
    // in this scenario, each igValue in the map represents a potential child node - and if we decide to branch
    // on that child node, the counts of each will become the node in question.
    // TODO ! abstract away this data map into a class that does this action for each node
    // TODO ! abstract away this data map into a class that does this action for each node
    // TODO ! abstract away this data map into a class that does this action for each node
    // basically each node should be a data map with a set of training data within itself !!!! and it should have a method
    // to sub-divide based on a given ig field and category field.
    // the IG function should be purely mathematical, this should be a part of the node.
    const dataMap = trainingData.reduce((map, obj) => {
        const { [categoryField]: catValue, [igField]: igValue } = obj;
        if (!map.get(igValue)) {
            map.set(igValue, new Map());
            map.get(igValue).set(COUNT, 0);
        }

        const igMap = map.get(igValue);
        igMap.set(COUNT, igMap.get(COUNT) + 1);

        if (!igMap.get(catValue)) {
            igMap.set(catValue, 1);
        } else {
            igMap.set(catValue, (igMap.get(catValue) + 1));
        }

        return map;
    }, new Map());

    dataMap.forEach((val, key) => {
        //
    });

    return { dataMap };
};


const ig_bak = (trainingData, attributeMapObject, classificationMapObject) => {
    // here we want to sort each training input into a 2 teir list which is keyed on the attribute value and the
    // input classification. First build the data structure your inputs will fall into :
    const totalLength = trainingData.length;
    // here we want to sort each training input into a 2 teir list which is keyed on the attribute value and the
    // input classification. The first level of this structure is a map, the lower level an array.
    const sortedInputs = new SortedInputMap({trainingData, attributeMapObject, classificationMapObject});

    // now get the entropy for each of the buckets discovered - each L1 bucket is a possible branch, each L2 bucket
    // expresses the uncertainty within it (it's divided amongst the different classes).
    // _calculateEntropies(sortedInputs, totalLength);
    // const entropies = [];
    // here attrMap is a map with 2 props : total and values. values is another map of cat val to array
    for (let attrMap of sortedInputs.values()) {
        const entropy = entropyForSeries(attrMap.get('values'), totalLength);
        attrMap.set('entropy', entropy);
    }

    let infoGain = 1;
    // to calculate info gain, in series we subtract probability * etnropy
    // note here we are talking about the probability of the L1 bucket, of the given attribute value, not related to
    // the L2 buckets of classes.
    for (let attrMap of sortedInputs.values()) {
        const probability = attrMap.get('total') / totalLength;
        const entropy = attrMap.get('entropy');
        infoGain -= (probability * entropy)
    }

    // TODO !!! If the sortedInputs has 0 matches for inputs, then information gain is 1 because there are no
    // TODO !!! entropies to subtract !!!! Do not include branches with no inputs!!!!!
    return {
        informationGain: infoGain,
        sortedInputs
    };
};
