const {fetchData} = require('./util.js');

const day = 22;
let file = 'sample';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
// 454 is too low
// 465 is too low
// file = 'sample';
// console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));
// file = 'input';
// console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));

function part1(file) {
    const bricks = fetchData(file).map(parseBrickEntry).sort(byZ);

    drop(bricks);
    console.info('Total:', bricks.length);
    return bricks.filter(b => canBeRemoved(b, bricks)).length;
}

function parseBrickEntry(line) {
    const [start, end] = line.split('~')
        .map(b => b.split(',').map(s => Number(s)))
        .sort(byZ);
    
    return ({
        x: [start[0], end[0]],
        y: [start[1], end[1]],
        z: [start[2], end[2]]
    });
}

function drop(bricks) {
    for (b of bricks) {
        const newZ = highestPointBelow(b, bricks) + 1;
        const zDiff = b.z[0] - newZ;

        b.z[0] -= zDiff;
        b.z[1] -= zDiff;
    }
}

// Not supporting any bricks that have no other support
function canBeRemoved(b, bricks) {
    const dependents = bricksSupported(b, bricks);

    return !dependents.some(d => bricksSupporting(d, bricks).length === 1);
}

function bricksSupported(b, bricks) {
    const result = bricks.filter(b2 => (b2.z[0] === b.z[1] + 1) && overlapXY(b, b2));

    // console.info(`${JSON.stringify(b)} supports ${JSON.stringify(result)}`);
    return result;
}

function bricksSupporting(b, bricks) {
    const result = bricks.filter(b2 => (b2.z[1] === b.z[0] - 1) && overlapXY(b, b2));

    // console.info(`${JSON.stringify(b)} is supported by ${result.length}`);
    return result;
}

function byZ(a, b) { return ascending(a[2], b[2]); }
function ascending(a, b) { return a - b; }

function highestPointBelow(brick, bricks) {
    // bricks are sorted by Z but get out of order
    // Might want to give the index coming in
    const lastBrickBelow = bricks.findLastIndex(b => b.z[1] < brick.z[1]);
    const bricksBelow = bricks.slice(0, lastBrickBelow+1)
        .filter(b => overlapXY(brick, b));

    return Math.max(0, ...bricksBelow.map(b => b.z[1]));
}

function overlapXY(b1, b2) {
    return rangesOverlap(b1.x, b2.x) && rangesOverlap(b1.y, b2.y);
}

function rangesOverlap(r1, r2) {
    const result =  r1[0] >= r2[0] ? r1[0] <= r2[1] : r2[0] <= r2[1];
    // console.info(`Ranges overlap? ${r1}, ${r2}: ${result}`);
    return result;
}