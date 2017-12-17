"use strict";


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
const informationGain = (children, totalCount, classificationField) => {

    let entropy = 0;

    // TODO ! moved into where I create chidren
    // for (let segment of children) {
    //     const { trainingData } = segment;
    //     // here we must find counts for the different values of X :
    //     // TODO ! perhaps we can do this while segmenting the data - simply increment each value of X within the counter map!
    //     // TODO ! that would save time.
    //     segment.valuesOfX = trainingData
    //         .reduce((map, curr) => {
    //             const value = curr[classificationField];
    //             if (Number(map.get(value)) !== map.get(value)) {
    //                 map.set(value, 0);
    //             }
    //             map.set(value, map.get(value) + 1);
    //             return map;
    //         }, new Map());
    //
    //     const probability = segment.trainingData.length / totalCount;
    //     entropy -= probability * Math.log2(probability);
    // }

    // now we find the specific conditional entropy for each value of X within children of Y :
    for (let segment of children) {
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

    const conditionalEntropy = children => {
        let conditionalEntropy = 0;
        for (let segment of children) {
            const { probability, specificConditionalEntropy } = segment;
            conditionalEntropy += probability * specificConditionalEntropy;
        }
        return conditionalEntropy;
    };

    const informationGain = entropy - conditionalEntropy;

    return {
        informationGain,
        conditionalEntropy,
        entropy
    }
};

module.exports = informationGain;
