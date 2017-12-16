"use strict";


/**
 * Decision Tree Node shall have properties :
 *      - Children: Array of DCT Nodes
 *      - branchAttribute : the attribute that it branches on to get children
 *      - trainingData: Array of training data objects in the current node
 *      - count: count of trainingData objects
 *      - parentCount: same from parent, for calculating probability
 *      - probability
 *      - entropy: from counts child nodes
 *      - conditionalEntropy: entropy of classification data values within child nodes
 *      - IG: the information gained by branching on the branchAttribute
 *
 */
class DecisionTreeNode {
    //
}
