const {sum, fetchData} = require('./util.js');

console.info('Part 1 sample:', part1('./day4sample.txt'));
console.info('Part 1 input:', part1('./day4input.txt'));
console.info('Part 2 sample:', part2('./day4sample.txt'));
console.info('Part 2 input:', part2('./day4input.txt'));

function part1(file) {
    return sum(pointsInCards(fetchData(file)));
}

function pointsInCards(lines) {
    return lines.map(pointsInCard);
}

function pointsInCard(line) {
    const matchCount = matchesInCard(line);

    return matchCount > 0 ? Math.pow(2, matchCount - 1) : 0;
}

function matchesInCard(line) {
    const [winners, picks] = line.match(/:(.*)\|(.*)/).slice(1);
    const winningNumbers = winners.match(/\d+/g);
    const pickNumbers = picks.match(/\d+/g);

    return winningNumbers.filter(n => pickNumbers.includes(n)).length;
}

function part2(file) {
    return sum(proliferateScratchcards(fetchData(file)));
}

function proliferateScratchcards(lines) {
    const copies = lines.map(l => 1);

    lines.forEach((line, index) => {
        const p = matchesInCard(line);

        // console.info(`Card ${index} wins ${p}`);
        if (p > 0) {
            for (let i = index + 1; i <= index + p; ++i ) {
                copies[i] += copies[index];
            }
        }
    });
    // console.info('Copies', copies);
    return copies;
}