const {fetchData, sum} = require('./util.js');

const day = 19;
let file = 'sample';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'sample';
console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));

function part1(file) {
    const [rawWorkflow, rawTools] = fetchData(file, false).split('\n\n');
    const flows = parseRawWF(rawWorkflow);
    const tools = parseRawTools(rawTools);
    const accepted = tools.filter(t => process(t, flows, flows.in));

    return sum(accepted.map(rating));
}

function part2(file) {
    const [rawWorkflow] = fetchData(file, false).split('\n\n');
    const flows = parseRawWF(rawWorkflow);
    const breakpoints = getBreakpoints(flows);

    for (const c of 'xmas') {
        console.info(`${c}:`, breakpoints[c].length);
        console.info(breakpoints[c]);
    }
    return combinations(breakpoints, flows);
}

function parseRawWF(raw) {
    const flows = raw.split('\n')
        .map(line => line.replace(/,[^,]*:A,A/, ',A'))
        .map(line => line.replace(/,[^,]*:R,R/, ',R'))
        .map(line => line.split('{'))
        .reduce((a, [name, flow]) => {
            a[name] = parseFlow(flow);
            return a;
        }, {});

    return flows;
}

function parseRawTools(raw) {
    return raw.split('\n').map(line => {
        return line.match(/(?:(\w)=(\d+),?)/g)
            .reduce((a, b) => {
                const [key, val] = b.replace(',','').split('=');
                a[key] = +val;
                return a;
            }, {});
    });
}

function parseFlow(flow) {
    return flow.replace('}', '').split(',').map(step => {
        const [_, test, dest] = step.match(/^(?:([^:]+):)?(.*)/);

        return {test, dest};
    });
}

function process(tool, flows, flow) {
    // console.info('Process', flow);
    const [test, ...rest] = flow;
    const testResult = testTool(tool, test);

    if (testResult === false) {
        return process(tool, flows, rest)
    }
    // console.info('Testresult', testResult);
    if (testResult in flows) {
        return process(tool, flows, flows[testResult]);
    }
    return testResult === 'A';
}

function rating(tool) {
    return sum(Object.values(tool));
}

function testTool(tool, {test, dest}) {
    if (test === undefined) {
        return dest;
    }
    const [_, key, comp, val] = test.match(/(\w)(\W)(.*)/);
    // console.info('  Test', {key, comp, val, toolVal: tool[key]});
    if (comp === '>') {
        return tool[key] > +val ? dest : false;
    }
    if (comp === '<') {
        return tool[key] < +val ? dest : false;
    }

    console.warn('!!!Should not reach!!!', val);
    return 'A';
}

function getBreakpoints(flows) {
    const result = {x: [1], m: [1], a: [1], s: [1]};

    for (const testSeries of Object.values(flows)) {
        for (const {test} of testSeries.filter(s => s.test !== undefined)) {
            const [key, comp, val] = parseTest(test);
            // A breakpoint is the lowest value of its group
            const bp = comp === '<' ? val : val + 1;
            const i = result[key].indexOf(bp);

            if (i < 0) {
                result[key].push(bp);
            }
        }
    }
    for (const c of 'xmas') {
        result[c].sort((a, b) => a - b);
    }
    return result;
}

function parseTest(test) {
    const [_, key, comp, valS] = test.match(/(\w)(\W)(.*)/);
    const val = +valS;

    return [key, comp, val];
}

function combinations(breakpoints, flows) {
    let result = 0;
    const start = Date.now()/1000;

    for (const x of breakpoints.x) {
        console.info('X', x, ' time:', Date.now()/1000 - start);
        for (const m of breakpoints.m) {
            for (const a of breakpoints.a) {
                for (const s of breakpoints.s) {
                    const tool = {x,m,a,s};
                   
                    if (process(tool, flows, flows.in)) {
                        let thisCount = 1;
                        for (const c of 'xmas') {
                            const i = breakpoints[c].indexOf(tool[c]);
                            const nextBp = breakpoints[c][i+1] ?? 4001;
                    
                            thisCount *= nextBp - tool[c];
                        }
                        result += thisCount;
                    }
                }
            }
        }
    }

    return result;
}

function countToolsInGroup(tool, breakpoints) {
    result = 1;

    for (const c of 'xmas') {
        const i = breakpoints[c].indexOf(tool[c]);
        const nextBp = breakpoints[c][i+1] ?? 4001;

        result *= nextBp - tool[c];
    }
    return result
}