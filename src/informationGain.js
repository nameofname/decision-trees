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


/**
 * Calculate the information gain for a given field to another field
 */
module.exports = (trainingData, categoryField, igField) => {
    // TODO ! we are going to ignore the testFunctions for now and assume we can do this just by detecting probability of value X for igField
    let ig = 1;
    const dataMap = trainingData.reduce((map, obj) => {
        // for each piece of training data, we want to calculate the probability that the igField will be a certain value
        // and connect that to our category field to find the relationship between the two.
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

    return dataMap;
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
