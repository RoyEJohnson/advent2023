const fs = require('fs');

console.info('Part 1 sample:', part1('./day3sample.txt'));
console.info('Part 1 input:', part1('./day3input.txt'));
console.info('Part 2 sample:', part2('./day3sample.txt'));
console.info('Part 2 input:', part2('./day3input.txt'));

function part1(file) {
    return sum(partsInLines(fetchData(file)));
}

function part2(file) {
    return sum(gearRatios(gearsInLines(fetchData(file))));
}

function partsInLines(lines) {
    const re = new RegExp('\\d+', 'g');

    return lines.map((str, lineNo) => {
        let ma;
        let lineTotal = 0;

        while ((ma = re.exec(str)) !== null) {
            if (isPart(lines, lineNo, ma)) {
                lineTotal += +ma[0];
            }
        }
        return lineTotal;
    })
}

function isPart(lines, lineNo, match) {
    // console.info('**', lineNo, match);
    const y = Math.max(0, lineNo - 1);
    const y2 = Math.min(lines.length - 1, lineNo + 1);
    const x = Math.max(0, match.index - 1);
    const x2 = Math.min(match.input.length, match.index + match[0].length + 1 );

    for (let i = y; i <= y2; ++i) {
        const testStr = lines[i].substring(x, x2);

        if (testStr.match(/[^0-9.]/)) {
            return true;
        }
    }
    return false;
}

// a gear is just an array of two numbers
function gearRatios(gears) {
    return gears.map(g => g[0] * g[1]);
}

function gearsInLines(lines) {
    const re = new RegExp('\\*', 'g');
    const gears = []

    lines.forEach((str, lineNo) => {
        while ((ma = re.exec(str)) !== null) {
            let candidateGear = adjacentNumbers(lines, lineNo, ma);

            if (candidateGear.length === 2) {
                // console.info('Gear:', candidateGear);
                gears.push(candidateGear);
            }
        }
    });
    return gears;
}

function adjacentNumbers(lines, lineNo, ma) {
    const y = Math.max(0, lineNo - 1);
    const y2 = Math.min(lines.length - 1, lineNo + 1);
    const adjacentNumbers = [];

    for (let i = y; i <= y2; ++i) {
        const line = lines[i];
        const x = lastNonDigitBefore(ma.index, line);
        const x2 = firstNonDigitAfter(ma.index, line);

        // console.info('** substr', x, x2, line.substring(x, x2));
        adjacentNumbers.push(...(line.substring(x, x2).match(/\d+/g) ?? []));
    }
    return adjacentNumbers;
}

function lastNonDigitBefore(index, line) {
    const end = Math.max(0, index - 1);
    const re = new RegExp(`^.{0,${end}}\\D`);
    const ma = line.match(re);

    // console.info('RE/MA', re, ma);
    return ma ? ma[0].length - 1 : 0;
}

function firstNonDigitAfter(index, line) {
    const start = Math.min(line.length - 1, index + 1);
    const re = new RegExp(`^.{${start},}?\\D`);
    const ma = line.match(re);

    return ma ? ma[0].length - 1 : line.length;
}

function sum(arr) {
    return arr.reduce((a, b) => a + +b, 0); // as numbers
}

function fetchData(file) {
    return fs.readFileSync(file, 'utf8').split(/\n/);
}
