const {fetchData, sum} = require('./util.js');

console.info('D12P1 sample:', part1('./day12sample.txt'));
console.info('D12P1 input:', part1('./day12input.txt'));

function part1(file) {
    const lines = fetchData(file);

    // return (countArrangements(lines[5].split(' ')));
    // console.info(lines.map(line => countArrangements(line.split(' '))));
    // 5696 too low
    // 7977 too high
    return(sum(lines.map(line => countArrangements(line.split(' ')))));
}

function countArrangements([pattern, runs]) {
    const [first, ...rest] = runs.split(',');
    const matchFirst = runMatch(first);
    const matchRest = rest.map(n => `[.?]${runMatch(n)}`).join('');
    const re = new RegExp(`^(${matchFirst})(${matchRest}[.?]*)$`);
    const ma = pattern.match(re);

    if (!ma) {
        // console.info('** No match:', pattern, runs, re);
        return 0;
    }
    const tail = rest.length > 0 ? countArrangements([ma[2].substr(1), rest.join(',')]) : 1;
    // console.info('*** First match', ma[0], ma[1], runs, '-->', tail, 'combos');

    // Now cut a character off the front and see if we can still make a match
    // Cut the lead-in junk off of the first match, plus the first character
    // want the trailing first - 1 chars
    // But don't cut off any #s!
    const reducedFirstMatchIndex = ma[1].length - first + 1;
    const firstHash = pattern.indexOf('#');

    if (firstHash > -1 && firstHash < reducedFirstMatchIndex) {
        return tail;
    }

    const reducedPattern = pattern.substring(reducedFirstMatchIndex);

    // console.info('** Using reduced pattern', reducedPattern);
    return tail + countArrangements([reducedPattern, runs]);
}

function runMatch(n) {
    return `[?.]*?[#?]{${n}}`;
}