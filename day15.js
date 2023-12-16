const {fetchData, sum} = require('./util.js');

const day = 15;
let file = 'sample';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'sample';
console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));

function part1(file) {
    const steps = fetchData(file, false).replace('\n', '').split(',');

    return sum(steps.map(hash));
}

function part2(file) {
    const steps = fetchData(file, false).replace('\n', '').split(',');
    const boxes = Array(256).fill(0).map(_ => []);

    for (const step of steps) {
        const [label, operation, focalLength] = step.match(/(.*)(-|=)(.*)/).slice(1);
        const box = boxes[hash(label)];

        if (operation === '-') {
            deleteLens(label, box);
        } else {
            addLens([label, focalLength], box);
        }
    }
    return sum(boxes.map(focusPowerOfBox));
}

function hash(str) {
    let result = 0;

    for (const c of str) {
        result += c.charCodeAt(0);
        result *= 17;
        result %= 256;
    }
    return result;
}

function deleteLens(label, box) {
    const index = box.findIndex(([l]) => l === label);

    if (index >= 0) {
        box.splice(index, 1);
    }
}

function addLens([label, focalLength], box) {
    const foundBox = box.find(([l]) => l === label);

    if (foundBox) {
        foundBox[1] = focalLength;
    } else {
        box.push([label, focalLength]);
    }
}

function focusPowerOfBox(box, boxIndex) {
    const boxNo = boxIndex + 1;
    const lensPowers = box.map(([label, length], li) => (li + 1) * length);

    return boxNo * sum(lensPowers);
}