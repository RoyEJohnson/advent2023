const {fetchData, sum} = require('./util.js');

const ENDNODE = {End: {}};

const day = 17;
let file = 'sample';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
// file = 'sample';
// console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));
// file = 'input';
// console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));

function part1(file) {
    const matrix = fetchData(file).map(line => line.split(''));
    const path = dijkstra(matrix);

    return path;
}

function dijkstra(matrix) {
    const startingCosts = exits(matrix, 0, 0, '>', -1);
    console.info('Starting costs', startingCosts);
    const costs = {End: Infinity, ...startingCosts};
    const parents = ENDNODE;
    const processed = [];

    let node = findLowestCostNode(costs, processed);

    while (node) {
        let cost = costs[node];
        let children = exits(matrix, ...node.split(','));
        for (let n in children) {
            let newCost = cost + children[n];
            if (!costs[n] || costs[n] > newCost) {
                costs[n] = newCost;
                parents[n] = node;
            }
        }
        processed.push(node);
        node = findLowestCostNode(costs, processed);
        if (node === 'End') {
            console.info('Parents?', parents.End);
        }
    }
    console.info('Out of nodes', parents.End);

    let optimalPath = ['End'];
    let parent = parents.End;
    while (parent) {
        optimalPath.push(parent);
        parent = parents[parent];
    }
    optimalPath.reverse();

    return {distance: costs.End, path: optimalPath};
};

function exits(matrix, rowS, colS, dir, sinceTurnS) {
    const [row, col, sinceTurn] = [rowS, colS, sinceTurnS].map(s => Number(s));
    const result = [];

    if (sinceTurn < 2) {
        const node = step(matrix, row, col, dir, 1 + sinceTurn);

        if (node) {
            result.push(node);
        }
    }
    for (const newDir of [turnLeft(dir), turnRight(dir)]) {
        const node = step(matrix, row, col, newDir, 0);

        if (node) {
            result.push(node);
        }
    }
    return result.reduce((a, b) => Object.assign(a, b), {});
}

function findLowestCostNode(costs, processed) {
    return Object.keys(costs).reduce((lowest, node) => {
        if (lowest === null || costs[node] < costs[lowest]) {
            if (!processed.includes(node)) {
                lowest = node;
            }
        }
        return lowest;
    }, null);
};

// A node is a unique key and a cost
function step(matrix, row, col, dir, sinceTurn) {
    if (row === matrix.length - 1 && col === matrix[0].length - 1) {
        return {End: 1};
    }

    const newRow = dir === '^' ? row - 1 : dir === 'v' ? row + 1 : row;
    const newCol = dir === '>' ? col + 1 : dir === '<' ? col - 1 : col;

    if (newRow >= 0 && newRow < matrix.length && newCol >= 0 && newCol < matrix[0].length) {
        const key = [newRow, newCol, dir, sinceTurn].join(',');

        return { [key]: +matrix[row][col] };
    }
    return null;
}

function turnLeft(dir) {
    return {
        '>': '^',
        '^': '<',
        '<': 'v',
        'v': '>'
    }[dir];
}

function turnRight(dir) {
    return {
        '>': 'v',
        'v': '<',
        '<': '^',
        '^': '>'
    }[dir];
}