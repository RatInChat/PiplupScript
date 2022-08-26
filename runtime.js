const ps = require("prompt-sync");
const prompt = ps();

function scream(...args) {
    console.log(...args);
}

function input(...args) {
    return prompt(...args);
}

function add(x, y) {
    return x + y;
}

function concat(s1, s2) {
    return s1 + s2;
}

function subtract(x, y) {
    return x - y;
}

function multiply(x, y) {
    return x * y;
}

function divide(x, y) {
    return x / y;
}

function sqrt(x) {
    return Math.sqrt(x);
}

function pow(x, y) {
    return Math.pow(x, y);
}

function eq(x, y) {
    return x === y;
}

function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time * 1000));
}
