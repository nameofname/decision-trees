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


const createDataMap = (trainingData, categoryField, igField) => {
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

/**
 * Calculate the information gain for a given field to another field
 *
 * NOTES : Here I have already sub-divided my data at a given node
 * Therefore, I know the total count, and the training data at the proposed child
 * The IG will be a measure of the relationship between values of classification data point and data point X - where
 * we want to know how much data point X correlates with the classification data.
 *
 * SO - what data will we need ?
 *  - Training data
 *  - total count (at current node)
 *  - classification field
 *  - IG field
 */
const informationGain = (trainingData, parentNodeCount, classificationField, igField) => {

    const proposedChildCount = trainingData.length;
    const probability = proposedChildCount / parentNodeCount;
    let ig = 1;

};

/**
 * To get the information gain, you first get the entropy for each proposed child node.
 * To get the entropy for a given child node, the formula is :
 *      ∑
 * @param trainingData
 * @param parentNodeCount
 * @param classificationField
 * @param igField
 */

/**
 * For various values of X, what is the entropy of Y -
 * this is known as the conditional entropy and it is comprised of many specific conditional entropies.
 *
 * ∑ P(X=v) * H(Y|X=v)
 *      - P(X=v) <Probability> is the probability X = v
 *      - H(Y|X=v) <Specific Conditional Entropy> is the entropy of Y given that X = v
 *
 * Given the training data and segmented on Y, what is the specific conditional entropy of
 * I don't know how to write this, so I'm going to start as if I had my data segmented ...
 */
const informationGain = (data, segmentedOn, classificationField) => {

    const { segments, totalCount } = data;
    data.entropy = 0;

    for (let segment of segments) {
        const { trainingData } = segment;
        // here we must find counts for the different values of X :
        // TODO ! perhaps we can do this while segmenting the data - simply increment each value of X within the counter map!
        // TODO ! that would save time.
        segment.valuesOfX = trainingData
            .reduce((map, curr) => {
                const value = curr[classificationField];
                if (Number(map.get(value)) !== map.get(value)) {
                    map.set(value, 0);
                }
                map.set(value, map.get(value) + 1);
                return map;
            }, new Map());

        const probability = segment.trainingData.length / totalCount;
        data.entropy -= probability * Math.log2(probability);
    }

    // now we find the specific conditional entropy for each value of X within segments of Y :
    for (let segment of segments) {
        const count = segment.trainingData.length;
        // to get the specific conditional entropy - we calculate the entropy of X within this bucket.
        const specificConditionalEntropy = segment.valuesOfX
            .reduce((specificEntropy, num) => {
                const probability = num / count;
                const entropyOfX = probability * Math.log2(probability);
                return specificEntropy + entropyOfX;
            });

        segment.probability = segment.trainingData.length / totalCount;
        segment.specificConditionalEntropy = specificConditionalEntropy;
    }

    data.conditionalEntropy = segments => {
        let conditionalEntropy = 0;
        for (let segment of segments) {
            const { probability, specificConditionalEntropy } = segment;
            conditionalEntropy += probability * specificConditionalEntropy;
        }
        return conditionalEntropy;
    };

    return data.entropy - data.conditionalEntropy;
};

module.exports = informationGain;
