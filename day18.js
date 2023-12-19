const {fetchData} = require('./util.js');

const day = 18;
let file = 'sample';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
// file = 'sample';
// console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));
// file = 'input';
// console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));

// 53194 is too low
// 52303 is too low

function part1(file) {
    const lines = fetchData(file);
    const verticals = getVerticalSegments(lines);

    //Total area is
    //total length of verticals
    // Plus dots between "inside" and "outside" edges
    // Plus spaces between same-direction segments

    // const verticalLength = verticals[2];
    const betweens = areaBetweenVerticals(verticals);

    return betweens;
}

function getVerticalSegments(lines) {
    const downs = [];
    const ups = [];
    let x = 0;
    let y = 0;
    let vLength = 0;

    for (const line of lines) {
        const [dir, lengthS] = line.split(' ');
        const length = Number(lengthS);

        if ('LR'.includes(dir)) {
            x += dir == 'L' ? -length : length;
        }
        if ('UD'.includes(dir)) {
            const newY = y + (dir === 'U' ? -length : length);
            (dir === 'D' ? downs : ups).push({
                x,
                y1: Math.min(y, newY),
                y2: Math.max(y, newY)
            });
            y = newY;
            vLength += length;
        }
    }

    const sortFn = (a, b) => a.y1 - b.y1 || a.x - b.x;

    return [downs.sort(sortFn), ups.sort(sortFn), vLength];
}

function areaBetweenVerticals([downs, ups]) {
    // console.info({downs: downs.slice(0, 10), ups: ups.slice(0, 10)});
    const startY = downs[0].y1;
    const endY = Math.max(...downs.map(d => d.y2));
    let result = 0;

    for (let y = startY; y <= endY; ++y) {
        const upsInRange = ups.filter(u => u.y1 <= y && u.y2 >= y);
        const downsInRange = downs.filter(d => d.y1 <= y && d.y2 >= y);

        result += areaDug(
            y,
            upsInRange.sort((a, b) => a.x - b.x),
            downsInRange.sort((a, b) => a.x - b.x)
        );
    }
    return result;
}

// Find the lowest x (either direction)
// If that entry ends at y and the next one starts at y, fill between them
// Fill to the lowest x entry in the other direction
// If *that* one ends at y and the next one starts at y, fill between them.
function areaDug(y, ups, downs) {
    const upX = ups.map(u => u.x);
    const downX = downs.map(d => d.x);
    const [inside, outside] = upX[0] < downX[0] ? [upX, downX] : [downX, upX];
    let result = 0;

    let outsideIndex = 0;
    let insideIndex = 0;
    // console.info('**', {inside, outside});
    while (insideIndex >= 0 && outsideIndex < inside.length) {
        const rightII = inside.findLastIndex(x => x < outside[outsideIndex]);

        const rightJag = inside[rightII] - inside[insideIndex] + 1;
        result += rightJag;
        insideIndex = rightII;            

        const between = outside[outsideIndex] - inside[insideIndex] - 1;
        // console.info('Add between', between);
        result += between;

        insideIndex = inside.findIndex(x => x > outside[outsideIndex]);

        const rightOI = insideIndex < 0 ?
            outside.length - 1
            : outside.findLastIndex(x => x < inside[insideIndex]);
        const oRJag = outside[rightOI] - outside[outsideIndex] + 1;
        result += oRJag;

        // console.info({rightJag, between, oRJag});
        outsideIndex = outside.findIndex(x => x > inside[insideIndex]);
    }

    // console.info(y, ':  Result:', result);
    return result;
}

