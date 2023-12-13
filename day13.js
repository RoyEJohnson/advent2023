const {fetchData, sum} = require('./util.js');

const day = 13;
let file = 'sample';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'sample';
console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));

function part1(file) {
    const grids = fetchData(file, false).split(/\n\n/).map(g => g.split(/\n/));

    return sum(grids.map(score));
}

function part2(file) {
    const grids = fetchData(file, false).split(/\n\n/).map(g => g.split(/\n/));

    return sum(grids.map(fixSmudgeAndScore));
    // 39565 is too high
    // 36669 is too low
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

function fixSmudgeAndScore(grid) {
    for (const [index, line] of Object.entries(grid)) {
        const rowC = smudgeCandidate(grid, line, +index);

        if (rowC) {
            // console.info('** Smudge row', rowC, index);
            return 100 * (+index + rowC + 1) / 2;
        }
    }

    const transposedGrid = transpose(grid);

    for (const [index, line] of Object.entries(transposedGrid)){
        const colC = smudgeCandidate(transposedGrid, line, +index);

        if (colC) {
            console.info('*** Smudge col', colC, index);
            return (+index + colC + 1) / 2;
        }
    }

    console.info('Did not find smudge', grid);
    return 0;
}

function smudgeCandidate(grid, line, index) {
    const candidates = findPossibleSmudges(grid, line, index);

    return candidates.find(c => verifyFix(grid, index, c));
}

function findPossibleSmudges(grid, line, index) {
    const candidates = [];

    for (let i2=+index + 1; i2 < grid.length; i2 += 2) {
        if (charDiff(line, grid[i2]) === 1) {
            candidates.push(i2);
        }
    }
    return candidates;
}

function verifyFix(grid, index, c) {
    const fixedGrid = fixGrid(grid, index, c);
    const reflectionLine = (index + c - 1) / 2;

    if (verify(reflectionLine, fixedGrid)) {
        // console.info('Fixed grid', fixedGrid);
        // console.info('Reflection line', reflectionLine);
        return true;
    }
    return false;
}

function fixGrid(grid, i1, i2) {
    return grid.map((r, i) => {
        return (i === i2) ? grid[i1] : r;
    });
}

function charDiff(s1, s2) {
    return s1.split('').filter((c, i) => c !== s2[i]).length;
}