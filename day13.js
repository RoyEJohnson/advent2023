const {fetchData, sum} = require('./util.js');

const day = 13;
let file = 'sample';
let part = 1;
console.info(`D${day}P${part} ${file}:`, part1(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P${part} ${file}:`, part1(`./day${day}${file}.txt`));

function part1(file) {
    const grids = fetchData(file, false).split(/\n\n/).map(g => g.split(/\n/));

    return sum(grids.map(score));
}

function score(grid) {
    return (100 * reflectionRow(grid)) || reflectionColumn(grid);
}

// Counting from 1; 0 means not found
function reflectionRow(grid) {
    const candidates = grid.map((_, i) => i).filter(i => grid[i] === grid[i + 1]);
    
    for (const c of candidates) {
        if (verify(c, grid)) {
            return c + 1;
        }
    }
    return 0;
}

function verify(c, grid) {
    for (let i = 1; c - i >= 0 && c + i + 1< grid.length; ++i) {
        if (grid[c-i] !== grid[c+i+1]) {
            // console.info('Failed match:', grid[c-i], grid[c+i]);
            return false;
        }
    }
    return true;
}

function reflectionColumn(grid) {
    return reflectionRow(transpose(grid));
}

function transpose(grid) {
    return grid[0].split('').map((_, i) => grid.map(r => r[i]).join(''));
}