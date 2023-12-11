const {fetchData, sum} = require('./util.js');

console.info('D11P1 sample:', part1('./day11sample.txt'));
console.info('D11P1 sample:', part1('./day11input.txt'));
console.info('D11P1 sample:', part2('./day11sample.txt'));
console.info('D11P1 sample:', part2('./day11input.txt'));

function part1(file) {
    const lines = fetchData(file).map(l => l.split(''));
    const galaxyCoordinates = findGalaxyCoordinates(lines, 2);
    const shortestPaths = findShortestPaths(galaxyCoordinates);

    return sum(shortestPaths);
}

function part2(file) {
    const lines = fetchData(file).map(l => l.split(''));
    const galaxyCoordinates = findGalaxyCoordinates(lines, 1e6);
    const shortestPaths = findShortestPaths(galaxyCoordinates);

    return sum(shortestPaths);
}

function findGalaxyCoordinates(lines, emptyValue) {
    const emptyRows = lines.map(l => !l.includes('#'));
    const emptyCols = lines[0].map((_, i) => !lines.map(l => l[i]).includes('#'));
    const result = [];

    // console.info('Empty Rows', emptyRows);
    // console.info('Empty Cols', emptyCols);

    let r = 0;
    lines.forEach((row, ri) => {
        let c = 0;
        row.forEach((col, ci) => {
            if (col === '#') {
                result.push([r, c]);
            }
            c += emptyCols[ci] ? emptyValue : 1;
        })
        r += emptyRows[ri] ? emptyValue : 1;
    });
    return result;
}

function findShortestPaths(coordinates) {
    const distances = coordinates.slice(0, coordinates.length-1)
        .map((g, i) => coordinates.slice(i+1).map(g2 => distance(g, g2)))
        .flat();

    return distances;
}

function distance(c1, c2) {
    return Math.abs(c1[0] - c2[0]) + Math.abs(c1[1] - c2[1]);
}