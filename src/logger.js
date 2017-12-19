// @flow

const colors = require('colors');
const noop = () => {};
const getLevel = ()=> {
    const logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';
    const levels = ['error', 'warn', 'info', 'trace'];
    return levels.indexOf(logLevel);
};
const log = (messages, color) => {
    const arr = messages.map(m => {
        const isPrimitive = ['string', 'number', 'boolean', 'undefined'].indexOf(typeof m) > -1 || m === null;
        const isError = m instanceof Error;
        if (isPrimitive || isError) {
            return m;
        } else if (m.toJSON) {
            return m.toJSON();
        } else if (m instanceof Error) {
            return m;
        } else if (Array.isArray(m) || m instanceof Object) {
            let ret = m;
            try {
                ret = JSON.stringify(m, null, 2);
            } catch (e) {
                return ret;
            }
            return ret;
        } else {
            return m;
        }
    });
    return console.log(...arr.map(a => color(a)));
};


const error = (...messages) => {
    const level = getLevel();
    return level > -1 ? log(messages, colors.red) : noop();
};
const warn = (...messages) => {
    const level = getLevel();
    return level > 0 ? log(messages, colors.yellow) : noop();
};
const info = (...messages) => {
    const level = getLevel();
    return level > 1 ? log(messages, colors.blue) : noop();
};
const trace = (...messages) => {
    const level = getLevel();
    return level > 2 ? log(messages, colors.grey) : noop();
};

module.exports = { error, warn, info, trace };
