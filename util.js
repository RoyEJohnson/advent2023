const fs = require('fs');

function sum(arr) {
    return arr.reduce((a, b) => a + +b, 0); // as numbers
}

function fetchData(file, split=true) {
    const data = fs.readFileSync(file, 'utf8');

    if (!split) {
        return data;
    }
    return data.split(/\n/);
}

module.exports = { sum, fetchData };