const {fetchData} = require('./util.js');

const day = 14;
let file = 'sample';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'sample';
console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));

function part1(file) {
    const grid = fetchData(file).map(r => r.split(''));

    rollRocksNorth(grid);
    return gridWeight(grid);
}

function part2(file) {
    const grid = fetchData(file).map(r => r.split(''));
    const cache = [];
    let str;
    let foundIndex = -1;

    // Sample repeats after 9, going back to 3: (1e9 - 9) % 7 => 4, plus 9
    // Input repeats after 130, going back to 109: (1e9 - 130) % 22 => 12, plus 130
    for (let i = 1; i <= 142; ++i) {
        rollRocksCycle(grid);
        str = gridToString(grid);
        foundIndex = cache.indexOf(str);
        if (foundIndex >= 0) {
            console.info(`${i} is a repeat of ${foundIndex + 1}`);
            console.info('Weight:', gridWeight(grid));
        } else {
            cache.push(str);
        }
    }
    return gridWeight(grid);
}

function rollRocksCycle(grid) {
    for (const i of 'nwse') {
        rollRocksNorth(grid);
        rotateGrid(grid);
    }
}

function rollRocksNorth(grid) {
    const stoppingPoints = Array(grid[0].length).fill(-1, 0);

    grid.forEach((r, ri) => {
        r.forEach((c, ci) => {
            if (c === '#') {
                stoppingPoints[ci] = ri;
            } else if (c === 'O') {
                stoppingPoints[ci] += 1;
                grid[ri][ci] = '.';
                grid[stoppingPoints[ci]][ci] = 'O';
            }
        })
    });

}

function rotateGrid(grid) {
    const rotated = [];

    for (let i = 0; i < grid[0].length; ++i) {
        const newRowData = grid.map(r => r[i]).reverse();

        rotated.push(newRowData);
    }
    grid.splice(0, grid.length, ...rotated);
}

function gridWeight(grid) {
    let result = 0;

    grid.forEach((r, ri) => {
        r.forEach((c, ci) => {
            if (c === 'O') {
                result += grid.length - ri;
            }
        })
    });
    return result;
}

function gridToString(grid) {
    return (grid.map(r => r.join('')).join('\n'));
}
function showGrid(grid, message='Grid') {
    console.info(`${message}:\n${gridToString(grid)}`);
}
