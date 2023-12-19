const {fetchData, sum} = require('./util.js');

const day = 19;
let file = 'sample';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
file = 'sample';
// console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));
// file = 'input';
// console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));

function part1(file) {
    const [rawWorkflow, rawTools] = fetchData(file, false).split('\n\n');
    const flows = parseRawWF(rawWorkflow);
    const tools = parseRawTools(rawTools);
    const accepted = tools.filter(t => process(t, flows, startFlow(t, flows)));

    return sum(accepted.map(rating));
}

function parseRawWF(raw) {
    const flows = raw.split('\n').map(line => line.split('{'))
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

function startFlow(tool, flows) {
    const initialOrder = Reflect.ownKeys(flows);
    const key = 'in';

    // console.info(' Start in', key);
    return flows[key];
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
