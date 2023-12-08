const {fetchData} = require('./util.js');

console.info('D8P1 sample 1:', part1('./day8sample1.txt'));
console.info('D8P1 sample 2:', part1('./day8sample2.txt'));
console.info('D8P1 input:', part1('./day8input.txt'));
console.info('D8P2 sample 3:', part2('./day8sample3.txt'));
console.info('D8P2 input:', part2('./day8input.txt'));

function part1(file) {
    const lines = fetchData(file);
    const turns = instructionDispenser(lines[0]);
    const map = parseMap(lines.slice(2));

    return countSteps('AAA',turns, map);
}

function part2(file) {
    const lines = fetchData(file);
    const map = parseMap(lines.slice(2));
    const initialKeys = Reflect.ownKeys(map).filter(k => k.match(/A$/));
    const cycles = initialKeys.map(k => countSteps(
        k, instructionDispenser(lines[0]), map
    ));

    return cycles.reduce((a, b) => lcm(a, b));
}

function instructionDispenser(lrList) {
    const values = lrList.split('');

    function next() {
        const instruction = values[next.count % values.length];

        ++next.count;
        return instruction;
    }
    next.count = 0;

    return next;
}

function parseMap(lines) {
    return lines.map(
        line => line.match(/\w{3}/g)
    ).reduce(
        (a, [key, left, right]) => {
            a[key] = [left, right]
            return a;
        },
        {}
    );
}

function countSteps(initialKey, turns, map) {
    for(let key = initialKey; !key.match(/Z$/); ) {
        let index = turns() == 'L' ? 0 : 1;

        key = map[key][index];
        // console.info('Key', key);
    }
    return turns.count;
}

function gcd(a, b) {
    return !b ? a : gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);   
}

