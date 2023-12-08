const {fetchData} = require('./util.js');

console.info('D5P1 sample:', part1('./day5sample.txt'));
console.info('D5P1 input:', part1('./day5input.txt'));
console.info('D5P2 sample:', part2('./day5sample.txt'));

function part1(file) {
    const chunks = fetchData(file, false).split('\n\n');
    const seeds = chunks[0].match(/\d+/g).map(toNumber);
    const chain = chunks.slice(1).map(rangeMap)

    return Math.min(...locationsForSeeds(seeds, chain));
}

function part2(file) {
    const chunks = fetchData(file, false).split('\n\n');
    const chain = chunks.slice(1).map(rangeMap)
    const seedRanges = parseSeedRanges(chunks[0]);
    const loc = locationsForSeedRanges(seedRanges, chain).map(
        (p) => p[0]
    );

    console.info('Locations:', loc);

    return Math.min(...loc);
}

function parseSeedRanges(line) {
    const pairs = line.match(/\d+ \d+/g).map(p => p.split(' ').map(toNumber));

    return pairs;
}

function rangeMap(chunk) {
    const lines = chunk.split(/\n/).slice(1);

    return lines.map(l => l.split(' ').map(toNumber));
}

function toNumber(str) { return +str; }

function locationsForSeeds(seeds, chain) {
    return seeds.map(s => traverseChain(s, chain))
}

function traverseChain(seed, chain) {
    let source = seed;
    let dest;

    // console.info('-- Starting', source);
    for (const table of chain) {
        dest = source;
        for (const [ds, ss, r] of table) {
            if (source >= ss && source < ss + r) {
                const diff = source - ss;

                dest = ds + diff;
                break;
            }
        }
        source = dest;
    }
    // console.info('Dest:', dest);
    return dest;
}

function locationsForSeedRanges(seedRanges, chain) {
    // Could just use sourceRanges, but it feels weird
    let sourceRanges = seedRanges;
    let destRanges;

    for (const table of chain) {
        destRanges = processRangesInTable(sourceRanges, table);
        sourceRanges = destRanges;
    }
    return destRanges;
}

function processRangesInTable(ranges, table) {
    const dest = [];
    let source = ranges;
    let nextSource;
    for (const row of table) {
        nextSource = [];
        for (const range of source) {
            [below, above, overlap] = extractDestinationRange(
                range, row
            );
            if (overlap) { dest.push(overlap) }
            if (below) { nextSource.push(below) }
            if (above) { nextSource.push(above) }
        }
        source = nextSource;
    }
    if (ranges.length < 5) {
        console.info('** Ranges', ranges);
        console.info('** Table', table);
        console.info('** Dest', dest);
    }
    return dest.concat(nextSource);
}

// Every source range breaks the sourceRange into three subsets
// (possibly empty): below the range, overlap in range, above the range
// (It's not always seeds)
// The overlap becomes a destination group; the below and above
// remain source numbers
function extractDestinationRange(seedRange, tableRow) {
    const [ds, ss, r] = tableRow;
    const [bottom, top] = [seedRange[0], seedRange[0] + seedRange[1] - 1];
    const below = ss > bottom ? [bottom, ss - bottom] : null;
    const above = top > ss + r - 1 ? [ss + r, top - (ss + r - 1)] : null;
    const overlap = bottom >= ss && bottom < ss + r ?
        [ds + bottom - ss, Math.min(r, seedRange[1])] : null;

    return [below, above, overlap];
}
