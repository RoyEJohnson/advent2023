const {fetchData, sum, toNumber} = require('./util.js');

console.info('D9P1 sample:', part1('./day9sample.txt'));
console.info('D9P1 input:', part1('./day9input.txt'));
console.info('D9P2 sample:', part2('./day9sample.txt'));
console.info('D9P2 input:', part2('./day9input.txt'));

function part1(file) {
    const lines = fetchData(file);

    return sum(
        lines.map(line => {
            const numbers = line.split(' ').map(toNumber);
            const result = difference(numbers, 0, numbers.length);

            return result;
        })
    );

}

function part2(file) {
    const lines = fetchData(file);
    return sum(
        lines.map(line => {
            const numbers = line.split(' ').map(toNumber);
            const result = difference(numbers, 0, -1);

            return result;
        })
    );
}

// Zero-order differences are the number sequence
// First order are the differences (0..i-1), etc.
function difference(numbers, order, index) {
    if (order >= numbers.length) {
        return 0;
    }
    if (index < 0) {
        return difference(numbers, order, index + 1) -
            difference(numbers, order + 1, index );
    }
    if (order === 0 && index < numbers.length) {
        return numbers[index];
    }
    if (index > numbers.length - order - 1) {
        return difference(numbers, order, index - 1) +
        difference(numbers, order + 1, index - 1)
    }
    return difference(numbers, order - 1, index + 1) -
        difference(numbers, order - 1, index);
}
