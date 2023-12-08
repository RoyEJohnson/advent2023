const fs = require('fs');

console.info('Part 1 sample:', part1('./day3sample.txt'));
console.info('Part 1 input:', part1('./day3input.txt'));

function part1(file) {
    const lines = fetchData(file);
    return sum(
        lines.map((str, lineNo) => {
            const matches = str.match(/\d+/g)?.filter(num => isPart(num, lineNo));

            console.info(`** Line ${lineNo}: ${matches?.join(',') ?? 'x'}. ${matches?.reduce((a, b) => a + +b, 0) ?? 0}`)
            return matches?.reduce((a, b) => a + +b, 0) ?? 0;
        })
    );

    function isPart(num, lineNo) {
        const re = new RegExp(`(?:^|\\D)${num}(?:$|\\D)`);
        const {index} = lines[lineNo].match(re);
        console.info('INDEX', index, num, lines[lineNo]);
        const x = Math.max(0, index);
        const x2 = Math.min(lines[0].length, index + num.length + 2);
        const y = Math.max(0, lineNo - 1);
        const y2 = Math.min(lines.length - 1, lineNo + 1);

        // console.info('** Part?', num);
        for (let i = y; i <= y2; ++i) {
            const testStr = lines[i].substring(x, x2);

            console.info('** Check ', testStr);
            if (testStr.match(/[^0-9.]/)) {
                return true;
            }
        }
        if (lineNo > 0) {
            console.info('**** Prev', lines[lineNo - 1].substring(x, x2));
        }
        console.info('**** Line:', lines[lineNo].substring(x, x2));
        console.info('**** Next', lines[lineNo + 1]?.substring(x, x2));
        return false;
    }
}

function sum(arr) {
    return arr.reduce((a, b) => a + +b, 0); // as numbers
}

function fetchData(file) {
    return fs.readFileSync(file, 'utf8').split(/\n/);
}

// 553269 was guessed