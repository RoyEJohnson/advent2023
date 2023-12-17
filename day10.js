const {fetchData} = require('./util.js');

console.info('D10P1 sample:', part1('./day10sample.txt'));
console.info('D10P1 input:', part1('./day10input.txt'));
console.info('D10P2 sample:', part2('./day10sample2.txt'));
console.info('D10P3 sample:', part2('./day10sample3.txt'));
console.info('D10P2 input:', part2('./day10input.txt'));

function part1(file) {
    const lines = fetchData(file);
    const path = [findStart(lines)];

    while (notCompleteLoop(path)) {
        path.push(nextStep(path, lines));
    }
    // console.info('Path', path);
    return Math.floor(path.length / 2);
}

function part2(file) {
    const lines = fetchData(file);
    const path = [findStart(lines)];

    while (notCompleteLoop(path)) {
        path.push(nextStep(path, lines));
    }

    // console.info('Path', path);
    const splitLines = lines.map(l => l.split(''));
    // Corners: left to right, you will hit an L or F first, then a J or 7
    // L-J counts as 2 verticals; L-7 counts as one
    // F-7 counts as 2; F-J as one
    const verticals = []
    for (const [row,col] of path) {
        if (splitLines[row][col] === '|' ||
            splitLines[row].slice(col).join('').match(/^L-*7/) ||
            splitLines[row].slice(col).join('').match(/^F-*J/)
            )
        {
            verticals.push([row, col]);
        }
    }
    for (const [row,col] of path) {
        splitLines[row][col] = 'p';
    }
    for (const [row,col] of verticals) {
        splitLines[row][col] = 'P';
    }

    // If a . has an odd number of Ps to its left, it is inside
    let insides = 0;
    splitLines.forEach((line, row) => {
        let pathCrossings = 0;
        line.forEach((symbol, col) => {
            if (!'Pp'.includes(symbol)) {
                const pLeft = line.slice(0, col).filter(s => s === 'P').length;

                if (pLeft %2) {
                    ++insides;
                    splitLines[row][col] = '*';
                }
            }
        })
    });
    // console.info(splitLines.map(arr => arr.join('')).join('\n'));
    // 564 is too high
    return insides;
}

function findStart(lines) {
    const row = lines.findIndex(l => l.includes('S'));

    if (row < 0) {
        console.info('Not found in', lines);
    }
    const col = lines[row].indexOf('S');

    return [row, col];
}

function notCompleteLoop(path) {
    const start = path[0].toString();
    const end = path.slice(-1)[0].toString();
    return (path.length < 2 || start !== end);
}

function nextStep(path, lines) {
    const [row, col] = path.slice(-1)[0];
    const symbol = lines[row][col];

    // console.info('Row/Col/Symbol', row, col, symbol);
    if (symbol === 'S') {
        // return whichever connection
        if (row > 0 && '|7F'.includes(lines[row-1][col])) {
            return [row-1, col];
        }
        if (row < lines.length - 1 && '|LJ'.includes(lines[row+1][col])) {
            return [row+1, col];
        }
        if (col > 0 && '-7J'.includes(lines[row][col+1])) {
            return [row, col+1];
        }
        if ('-LF'.includes(lines[row][col-1])) {
            return [row, col-1];
        }
        console.info('** Cannot get started');
    }
    const cameFrom = path.slice(-2)[0].toString();

    return candidates(row, col, symbol).find(loc => loc.toString() !== cameFrom);
}

function candidates(row, col, symbol) {
    if (symbol === 'F') {
        return [[row+1, col], [row, col+1]];
    }
    if (symbol === '7') {
        return ([[row, col-1], [row+1, col]]);
    }
    if (symbol === 'L') {
        return ([[row-1, col], [row, col+1]]);
    }
    if (symbol === 'J') {
        return ([[row, col-1], [row-1, col]]);
    }
    if (symbol === '|') {
        return ([[row-1, col], [row+1, col]]);
    }
    if (symbol === '-') {
        return ([[row, col-1], [row, col+1]]);
    }
    console.info('*** Whoops', symbol);
}