"use strict";


const AttributeProperties = require('./AttributeProperties');
const informationGain = require('./informationGain');
const log = require('./colorLog');
let attributeProperties;
let classAttr;

/**
 * Recursive function builds the decision tree based on info gain, etc.
 *
 * @param trainingData - <array> of training input objects
 * @param attributeKeys - <array> of strings representing attributes
 * @param node - <Map> the current node in the decision tree being built
 * @private
 */
const _buildTree = (trainingData, attributeKeys, node) => {
    let chosenNextAttribute = {informationGain : null};
    let res;

    for (let attrKey of attributeKeys) {
        res = informationGain(trainingData, attributeProperties.get(attrKey), attributeProperties.get(classAttr));
        log.green(`Information Gain calculated for ${attrKey} : ${res.informationGain}`);
        chosenNextAttribute = res.informationGain > chosenNextAttribute.informationGain ? res : chosenNextAttribute;
    }
    log.blue(`highest information gain : ${chosenNextAttribute.informationGain }`);

    // if not node, then we are at the root node :
    if (!node) {
        node = new Map();
        node.set('children', new Map())
    }

    // branch on the highest IG attribute :
    for (let kv of res.sortedInputs) {
        const key = kv[0];
        const attributeMap = kv[1];
        const newNode = new Map();
        newNode.set('children', new Map());

        const splitTrainingData = [];
        for (let attrMap of chosenNextAttribute.sortedInputs.values()) {
            for (let classMap in attrMap.get('values')) {
                for (let classArr in classMap) {
                    splitTrainingData.concat(classArr);
                }
            }
        }

        // recursion
        // newNode.children.push()
        //
        // node.set(key, newNode)
    }

};


/**
 * @param getData <function> - async function that returns an object with the following properties :
 *      - trainingData <array> of objects (training inputs)
 *      - attributes <array> of objects (attributes ie. DB columns)
 *      - classificationAttribute <string> the attribute name to use as classifier
 */
const decisionTreeBuilder = async (getData) => {
    log.blue('START building decision tree');

    const { trainingData, attributes, classificationAttribute } = await getData();
    log.blue('Initial query done');
    classAttr = classificationAttribute;
    attributeProperties = new AttributeProperties({trainingData, attributeColumns : attributes});
    const attributeKeyArray = attributeProperties.keys();
    log.blue('Completed building attribute map');

    // classify each of the training inputs according to the classification attribute.
    trainingData.forEach(obj => {
        const possibleValues = attributeProperties.get(classificationAttribute).values;
        const testFn = attributeProperties.get(classificationAttribute).test;

        classFinder:
        for (var i = 0; i < possibleValues.length; i++) {
            if (testFn(obj, possibleValues[i])) {
                obj.class = possibleValues[i];
                break classFinder;
            }
        }
    });

    const decisionTree = _buildTree(trainingData, attributeKeyArray);
    return;

    return decisionTree;
};

module.exports = decisionTreeBuilder;
