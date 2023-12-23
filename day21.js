const {fetchData} = require('./util.js');

const day = 21;
let file = 'sample';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
// file = 'sample';
// console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));
// file = 'input';
// console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));

function part1(file) {
    const grid = fetchData(file).map(l => l.split(''));
    const newGrid = getGridAfterSteps(64, grid);

    return countSteps(newGrid);
}

function getGridAfterSteps(num, grid) {
    let oldGrid = grid;
    for (let steps = 1; steps <= num; ++steps) {
        let newGrid = addStep(oldGrid);

        oldGrid = newGrid;
    }
    return oldGrid;
}

function countSteps(grid) {
    return grid.map(r => r.join('')).join('\n').match(/O/g).length;
}

function addStep(grid) {
    const newGrid = blankCopy(grid);

    for (let ri = 0; ri < grid.length; ++ri) {
        for (let ci = 0; ci < grid[0].length; ++ci) {
            if (grid[ri][ci] === '#') {
                continue;
            }
            const neighbors = getNeighbors(grid, ri, ci);

            if (neighbors.some(v => 'SO'.includes(v))) {
                newGrid[ri][ci] = 'O';
            }
        }
    }
    return newGrid;
}

function blankCopy(grid) {
    return grid.map(r => r.map(c => c === '#' ? '#' : '.'));
}

function getNeighbors(grid, ri, ci) {
    const result = [];

    if (ri < grid.length - 1) {
        result.push(grid[ri + 1][ci])
    }
    if (ri > 0) {
        result.push(grid[ri - 1][ci])
    }
    if (ci < grid[0].length - 1) {
        result.push(grid[ri][ci + 1])
    }
    if (ci > 0) {
        result.push(grid[ri][ci - 1])
    }
    return result;
}

