"use strict";


/**
 * Calculate the information gain for a given field to another field.
 * This takes an array of DecisionTreeNode instances which have not yet been branched.
 *
 * Assume we are considering 2 attributes, X and Y.
 * X is our class attribute, and Y is our branch attribute.
 *
 * To get the information gain, you :
 *      - take the entropy of the parent node with regards to X (class attribute)
 *      - and subtract the conditional entropy of the child nodes
 *      - to get the conditional entropy we must sum over the specific conditional entropy of the child nodes.
 *      - specific conditional entropy is the entropy of X within a child node (segmented by Y)
 *
 * Formulas :
 *      - Probability of X having value v
 *          - "the probability that attribute X takes value v"
 *          P(X=v) = v / N
 *      - Entropy of X
 *          - "the uncertainty of attribute X equaling value v"
 *          H(X) = - ∑ P(X=v) * log2(P(X=v))
 *      - Specific Conditional Entropy of X
 *          - "the uncertainty of attribute X equaling value v given that we know the value of Y"
 *          H(X|Y=v) = - ∑ H(X=v)
 *      - Conditional Entropy of X
 *          - "the average specific conditional entropy of Y"
 *          H(X|Y) = ∑ P(X=v) * H(X|Y=v)
 *      - Information Gain
 *          ∑ H(X=v) * H(Y|X=v)
 * ∑ P(X=v) * H(Y|X=v)
 *      - P(X=v) <Probability> is the probability X = v
 *      - H(Y|X=v) <Specific Conditional Entropy> is the entropy of Y given that X = v
 *
 * Given the training data and segmented on Y, what is the specific conditional entropy of
 * I don't know how to write this, so I'm going to start as if I had my data segmented ...
 */
const informationGain = (children, totalCount) => {

    let entropy = 0;
    let conditionalEntropy = 0;
    const aggregateClassValues = new Map();

    // now we find the specific conditional entropy for each value of X within children of Y :
    children.forEach(childNode => {

        const count = childNode.trainingData.length;
        const probability = (count / totalCount);
        let specificConditionalEntropy = 0;

        // to get the specific conditional entropy - we calculate the entropy of X (class value) within this bucket.
        childNode.classValueCounts.forEach((num, key) => {
            const specificClassProbability = num / count;
            specificConditionalEntropy -= specificClassProbability * Math.log2(specificClassProbability);
            // aggregate values for class used in entropy of class value calculation :
            const aggregateClassValue = aggregateClassValues.get(key) || 0;
            aggregateClassValues.set(key, aggregateClassValue + num);
        });

        childNode.probability = probability;
        childNode.specificConditionalEntropy = specificConditionalEntropy;

        conditionalEntropy += probability * specificConditionalEntropy;
    });

    // Note* - we take the aggregate class value and calculate entropy - this gives us the entropy for X (our class
    // value) over the training data of the parent node.
    aggregateClassValues.forEach(num => {
        const classProbability = num / totalCount;
        entropy -= classProbability * Math.log2(classProbability);
    });

    const informationGain = entropy - conditionalEntropy;

    return {
        entropy,
        conditionalEntropy,
        informationGain
    }
};

module.exports = informationGain;
