"use strict";


class SortedInputMap extends Map {

    constructor({trainingData, attributeValues, attributeTest, classificationVals, classificationTest}) {
        super();

        this._trainingData = trainingData;
        this._attributeValues = attributeValues;
        this._attributeTest = attributeTest;
        this._classificationVals = classificationVals;
        this._classificationTest = classificationTest;

        this._parse();
    }

    _parse() {
        this._trainingData.forEach(input => {

            attrLoop:
                for (let attributeValue of this._attributeValues) {

                    const attrMatch = this._attributeTest(input, attributeValue);
                    if (attrMatch) {
                        if (!this.get(attributeValue)) {
                            const newMap = new Map();
                            newMap.set('categoryMap', new Map());
                            newMap.set('count', 0);
                            this.set(attributeValue, newMap);
                        }
                        const currAttrMap = this.get(attributeValue);

                        classLoop:
                            for (let classificationValue of this._classificationVals) {
                                const classMatch = this._classificationTest(input, classificationValue);
                                if (classMatch) {
                                    if (!currAttrMap.get('categoryMap').get(classificationValue)) {
                                        currAttrMap.get('categoryMap').set(classificationValue, []);
                                    }
                                    const currBucket = currAttrMap.get('categoryMap').get(classificationValue);
                                    currBucket.push(input);
                                    currAttrMap.set('count', (currAttrMap.get('count') + 1));
                                    break classLoop;
                                }
                            }
                        break attrLoop;
                    }
                }
        });
    }

    getTrainingData() {
        return this._trainingData;
    }
}


/**
 * This helper function builds a sorted map of the training data. The sorted output will be a map with 2 levels :
 *      L1 : a layer of maps, keyed on each attribute value
 *      L2 : a layer of arrays, each array including inputs sorted by class (classification)
 * Full structure is :
 *      - Map {
 *          [attribute value] : Map {
 *              count : number
 *              categoryMap : Map {
 *                  [category value] : [Array], ...
 *              }
 *          }, ...
 *      }
 * @param trainingData - training data to
 * @param attributeValues
 * @param attributeTest
 * @param classificationVals
 * @param classificationTest
 * @private
 */
module.exports = SortedInputMap;
