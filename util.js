const fs = require('fs');

function sum(arr) {
    return arr.reduce((a, b) => a + +b, 0); // as numbers
}

function fetchData(file) {
    return fs.readFileSync(file, 'utf8').split(/\n/);
}

module.exports = { sum, fetchData };