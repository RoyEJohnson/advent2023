const {fetchData, sum} = require('./util.js');

const day = 14;
let file = 'sample';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));

function part1(file) {
    const grid = fetchData(file).map(r => r.split(''));

    return sum(weightWhenRolledNorth(grid));
}

// Round rocks only
function weightWhenRolledNorth(grid) {
    const stoppingPoints = Array(grid[0].length).fill(grid.length + 1, 0);
    const results = [];

    grid.forEach((r, ri) => {
        r.forEach(
            (c, ci) => {
                if (c === '#') {
                    stoppingPoints[ci] = grid.length - ri;
                } else if (c === 'O') {
                    stoppingPoints[ci] -= 1;
                    results.push(stoppingPoints[ci]);
                }
            }
        )
    });
    // console.info('** Weights:', results);
    return results;
}