const {fetchData, sum} = require('./util.js');

const day = 7;
let file = 'sample';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'sample';
console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));
// 246433301 is too low

function part1(file) {
    const lines = fetchData(file);

    return sum(winnings(lines));
}

function part2(file) {
    const lines = fetchData(file);

    // lines.slice(0, 20).forEach((line) => {
    //     const [hand, bit] = line.split(' ');

    //     console.info(`${hand} rank: ${typeWithJ(hand)}`);
    // });
    return sum(winnings(lines, typeWithJ));
}

function winnings(lines, rankFn = type) {
    const compareFn = (a, b) => compareHands(a, b, rankFn);

    return lines.sort(compareFn).map((line, r) => {
        const bid = line.split(' ')[1];
        const rank = r + 1;

        return bid * rank;
    });
}

function compareHands(a, b, rankFn) {
    const [h1] = a.split(' ');
    const [h2] = b.split(' ');

    return rankFn(h1) - rankFn(h2) || compareCards(h1, h2);
}

// The difference between part 1 and part 2 is just what
// rankFn is used: type or typeWithJ
function type(hand) {
    const counts = countCards(hand.split(''));

    return rankHandByCounts(counts);
}

function typeWithJ(hand) {
    const cards = hand.split('');
    const nonJ = cards.filter(c => c !== 'J');
    const jCount = cards.filter(c => c === 'J').length;
    const njCounts = countCards(nonJ).sort().reverse();

    njCounts[0] += jCount;

    // console.info(`${hand} counts:`, njCounts);
    return rankHandByCounts(njCounts);
}

function countCards(cards) {
    return Object.values(cards.reduce((a, b) => {
        a[b] = (a[b] || 0) + 1;
        return a;
    }, {}));
}

function rankHandByCounts(counts) {
    if (counts.includes(5)) { return 7; }
    if (counts.includes(4)) { return 6; }
    if (counts.includes(3)) {
        if (counts.includes(2)) {
            return 5;
        }
        return 4;
    }
    const pairs = counts.filter(c => c === 2);
    if (pairs.length > 1) {
        return 3;
    }
    if (pairs.length > 0) {
        return 2;
    }
    return 1;
}

function compareCards(h1, h2) {
    const firstDiffIndex = h1.split('').findIndex((c, i) => h1[i] !== h2[i]);

    return cardValue(h1[firstDiffIndex]) - cardValue(h2[firstDiffIndex]);
}

function cardValue(card) {
    const values = '23456789TJQKA';

    return values.indexOf(card);
}