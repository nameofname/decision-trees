"use strict";

// taken from : https://www.youtube.com/watch?v=wNhnAogeHJQ

// Output data to test :
    // specific conditional entropy and probability :
    // Math: P = 0.5, E = 1
    // CS: P = 0.25, E = 0
    // History: 0.25 = x, E = 0
// RESULTS :
    // entropy of Y = 1
    // conditional entropy = 0.5
    // information gain = 0.5 ( = (entropy of 1) - (conditional entropy 0.5))

module.exports = [
    {
        major: 'Math',
        likes: true
    }, {
        major: 'History',
        likes: false
    }, {
        major: 'CS',
        likes: true
    }, {
        major: 'Math',
        likes: false
    }, {
        major: 'Math',
        likes: false
    }, {
        major: 'CS',
        likes: true
    }, {
        major: 'Math',
        likes: true
    }, {
        major: 'History',
        likes: false
    }
];
