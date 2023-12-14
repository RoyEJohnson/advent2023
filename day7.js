const {fetchData, sum} = require('./util.js');

const day = 7;
let file = 'sample';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
// file = 'sample';
// console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));
// file = 'input';
// console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));

function part1(file) {
    const lines = fetchData(file);

    return sum(winnings(lines));
}

function winnings(lines) {
    return lines.sort(compareHands).map((line, r) => {
        const bid = line.split(' ')[1];
        const rank = r + 1;

        return bid * rank;
    });
}

function type(hand) {
    const cards = hand.split('');
    const counts = Object.values(cards.reduce((a, b) => {
        a[b] = (a[b] || 0) + 1;
        return a;
    }, {}));

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

function compareHands(a, b) {
    const [h1] = a.split(' ');
    const [h2] = b.split(' ');

    return type(h1) - type(h2) || compareCards(h1, h2);
}

function compareCards(h1, h2) {
    const firstDiffIndex = h1.split('').findIndex((c, i) => h1[i] !== h2[i]);

    return cardValue(h1[firstDiffIndex]) - cardValue(h2[firstDiffIndex]);
}

function cardValue(card) {
    const values = '23456789TJQKA';

    return values.indexOf(card);
}