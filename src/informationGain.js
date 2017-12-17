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
const informationGain = (children, totalCount) => {

    let entropy = 0;

    // now we find the specific conditional entropy for each value of X within children of Y :
    for (let childNode of children) {

        const count = childNode.trainingData.length;
        let specificConditionalEntropy = 0;

        // to get the specific conditional entropy - we calculate the entropy of X within this bucket.
        childNode.classValueCounts.forEach(num => {
            const probability = num / count;
            const entropyOfX = probability * Math.log2(probability);
            return specificConditionalEntropy + entropyOfX;
        });

        childNode.probability = childNode.trainingData.length / totalCount;
        childNode.specificConditionalEntropy = specificConditionalEntropy;
    }

    let conditionalEntropy = 0;
    for (let childNode of children) {
        const { probability, specificConditionalEntropy } = childNode;
        conditionalEntropy += probability * specificConditionalEntropy;
    }

    const informationGain = entropy - conditionalEntropy;

    return {
        informationGain,
        conditionalEntropy,
        entropy
    }
};

module.exports = informationGain;
