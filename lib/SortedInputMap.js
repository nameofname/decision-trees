"use strict";


class SortedInputMap extends Map {

    constructor({trainingData, attributeValues, attributeTest, classificationVals, classificationTest}) {
        super();
        this.parse(trainingData, attributeValues, attributeTest, classificationVals, classificationTest);
    }

    parse(trainingData, attributeValues, attributeTest, classificationVals, classificationTest) {
        trainingData.forEach(input => {
            attrLoop:
                for (var i = 0; i < attributeValues.length; i++) {
                    const attrMatch = attributeTest(input, attributeValues[i]);
                    if (attrMatch) {
                        if (!this.get(attributeValues[i])) {
                            const newMap = new Map();
                            newMap.set('categoryMap', new Map());
                            newMap.set('total', 0);
                            this.set(attributeValues[i], newMap);
                        }
                        const currAttrMap = this.get(attributeValues[i]);
                        classLoop:
                            for (var j = 0; j < classificationVals.length; j++) {
                                const classMatch = classificationTest(input, classificationVals[j]);
                                if (classMatch) {
                                    if (!currAttrMap.get('categoryMap').get(classificationVals[j])) {
                                        currAttrMap.get('categoryMap').set(classificationVals[j], []);
                                    }
                                    const currBucket = currAttrMap.get('categoryMap').get(classificationVals[j]);
                                    currBucket.push(input);
                                    currAttrMap.set('total', (currAttrMap.get('total') + 1));
                                    break classLoop;
                                }
                            }
                        break attrLoop;
                    }
                }
        });
    }

    getMergedTrainingData() {
        const allTrainingData = [];
        for (let attrMap of this.values()) {
            for (let classArr of attrMap.get('categoryMap').values()) {
                allTrainingData.push(classArr);
            }
        }
        return [].concat.apply([], allTrainingData);
    }
}


/**
 * This helper function builds a sorted map of the training data. The sorted output will be a map with 2 levels :
 *      L1 : a layer of maps, keyed on each attribute value
 *      L2 : a layer of arrays, each array including inputs sorted by class (classification)
 * Full structure is :
 *      - Map {
 *          [attribute value] : Map {
 *              total : number
 *              categoryMap : Map {
 *                  [category value] : [Array], ...
 *              }
 *          }, ...
 *      }
 * @param trainingData
 * @param attributeMapObject
 * @param classificationMapObject
 * @private
 */

// const PrivateTraningData = new WeakMap();
// const PrivateAttributeObj = new WeakMap();
// const PrivateClassificationObj = new WeakMap();

module.exports = SortedInputMap;
