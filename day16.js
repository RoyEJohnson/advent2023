const {fetchData, sum} = require('./util.js');

const day = 16;
let file = 'sample';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'sample';
console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));

function part1(file) {
    const grid = readGrid(file);

    traceBeam(grid, 0, 0, '>');
    return energizedCells(grid).length;
}

function part2(file) {
    const grid = readGrid(file);
    let result = 0;

    for (let c = 0; c < grid[0].length; ++c) {
        traceBeam(grid, 0, c, 'v');
        result = Math.max(result, energizedCells(grid).length);
        resetGrid(grid);
        traceBeam(grid, grid.length - 1, c, '^');
        result = Math.max(result, energizedCells(grid).length);
        resetGrid(grid);
    }
    for (let r = 0; r < grid.length; ++r) {
        traceBeam(grid, r, 0, '>');
        result = Math.max(result, energizedCells(grid).length);
        resetGrid(grid);
        traceBeam(grid, r, grid[0].length - 1, '<');
        result = Math.max(result, energizedCells(grid).length);
        resetGrid(grid);
    }
    return result;
}

function readGrid(file) {
    return fetchData(file)
    .map(line => line.split('').map(c => ({
        symbol: c,
        enteredFrom: []
    })));
}

function traceBeam(grid, row, col, dir) {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
        return;
    }

    // console.info('**', {row, col});
    const cell = grid[row][col];

    if (cell.enteredFrom.includes(dir)) {
        return;
    }
    cell.enteredFrom.push(dir);
    for (const exit of exits(cell.symbol, dir)) {
        // console.info('** Exit', {exit, cell, dir, row, col});
        const [dR, dC, newDir] = exit;

        traceBeam(grid, row + dR, col + dC, newDir);
    }
}

function energizedCells(grid) {
    const result = [];

    for (const r of grid) {
        for (const c of r) {
            if (c.enteredFrom.length) {
                result.push([r, c]);
            }
        }
    }
    return result;
}

function resetGrid(grid) {
    for (const r of grid) {
        for (const c of r) {
            c.enteredFrom = [];
        }
    }
}

function exits(symbol, dir) {
    if (
        symbol === '.' || (
            symbol === '-' && '<>'.includes(dir)
        ) || (
            symbol === '|' && '^v'.includes(dir)
        ))
    {
        return [follow(dir)];
    }
    if (symbol === '|') {
        return[follow('^'), follow('v')];
    }
    if (symbol === '-') {
        return [follow('<'), follow('>')];
    }
    if (symbol === '\\') {
        const newDir = {
            '>' : 'v',
            '<' : '^',
            'v' : '>',
            '^' : '<'
        }[dir];
        return [follow(newDir)];
    }
    if (symbol === '/') {
        const newDir = {
            '>' : '^',
            '<' : 'v',
            'v' : '<',
            '^' : '>'
        }[dir];
        // console.info('** Bounce // ', dir, newDir);
        return [follow(newDir)];
    }
    console.warn('What?', symbol, dir);
    return [];
}

function follow(dir) {
    return {
        '>': [0, 1],
        '<': [0, -1],
        '^': [-1, 0],
        'v': [1, 0]
    }[dir].concat(dir);
}
