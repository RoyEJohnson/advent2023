const {fetchData} = require('./util.js');

console.info('D10P1 sample:', part1('./day10sample.txt'));
console.info('D10P1 input:', part1('./day10input.txt'));
console.info('D10P2 sample:', part2('./day10sample2.txt'));

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

    console.info('Path', path);
    const splitLines = lines.map(l => l.split(''));
    for (const [row,col] of path) {
        splitLines[row][col] = 'P';
    }

    // For each dot, count the Ps in the column above
    // and also the Ps in the row to the left
    // If both are odd, inside
    let insides = 0;
    splitLines.forEach((line, row) => {
        line.forEach((symbol, col) => {
            if (symbol == '.') {
                const pAbove = splitLines.slice(0, row)
                    .filter(r => r[col] === 'P').length;
                const pLeft = line.slice(0, col).filter(s => s === 'P').length;

                // if (pAbove > 0) {
                //     console.info('**', row, col, pAbove, pLeft);
                // }
                if (pAbove %2 && pLeft %2) {
                    ++insides;
                    splitLines[row][col] = 'I';
                }
            }
        })
    });
    console.info('Splitlines', splitLines.map(l => l.join('')));
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