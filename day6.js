const {fetchData} = require('./util.js');

console.info('D6P1 sample:', part1('./day6sample.txt'))
console.info('D6P1 input:', part1('./day6input.txt'))
console.info('D6P2 sample:', part2('./day6sample.txt'))
console.info('D6P2 input:', part2('./day6input.txt'))

function part1(file) {
    const lines = fetchData(file);
    const times = lines[0].match(/\d+/g);
    const distances = lines[1].match(/\d+/g);

    return times.map(
        (t, i) => waysICanBeat(t, distances[i])
    ).reduce((a, b) => a * b);
}

function part2(file) {
    const lines = fetchData(file);
    const time = lines[0].match(/\d+/g).join('');
    const distance = lines[1].match(/\d+/g).join('');

    return waysICanBeat(time, distance);
}

// hold time is a root of a quadratic equation
function waysICanBeat(time, distance) {
    let [lo, hi] = quadratic(1, -time, distance);

    // Choose values that will win, not tie
    if (lo === Math.ceil(lo)) {
        lo += 1;
    } else {
        lo = Math.ceil(lo);
    }
    if (hi === Math.floor(hi)) {
        hi -= 1;
    } else {
        hi = Math.floor(hi)
    }
    return  hi - lo + 1;
}

function quadratic(a, b, c) {
    const disc = b * b - 4 * a * c;

    return [
        (-b - Math.sqrt(disc)) / (2 * a),
        (-b + Math.sqrt(disc)) / (2 * a)
    ];
}

