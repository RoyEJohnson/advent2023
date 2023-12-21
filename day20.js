const {fetchData, sum} = require('./util.js');

const LO = '-low-';
const HI = '-high-';

const day = 20;
let file = 'sample';
// console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
// file = 'input';
// console.info(`D${day}P1 ${file}:`, part1(`./day${day}${file}.txt`));
// file = 'sample';
// console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));
file = 'input';
console.info(`D${day}P2 ${file}:`, part2(`./day${day}${file}.txt`));

function part1(file) {
    const system = buildSystem(fetchData(file));
    let beamCounts = [];

    for (let i = 1; i <= 1000; ++i) {
        system.beamQueue.push({beam: LO, from: 'button', dest: 'broadcaster'});
        beamCounts.push(system.process());
    }

    const beamTotals = [0, 0];
    for (let i = 0; i < 1000; ++i) {
        // console.info('...Totals', beamTotals);
        beamTotals[0] += beamCounts[i][0];
        beamTotals[1] += beamCounts[i][1];
    }
    return beamTotals[0] * beamTotals[1];
}

function part2(file) {
    const system = buildSystem(fetchData(file));

    for (let i = 1; i <= 400000; ++i) {
        system.beamQueue.push({beam: LO, from: 'button', dest: 'broadcaster'});
        system.process();
    }

    const state = system.state();

    console.info('jm', state.jm);
    console.info('jv', state.jv);
    console.info('qs', state.qs);
}

function buildSystem(moduleSpecs) {
    const modules = {};
    const beamQueue = [];
    const state = () => buildState(modules);
    const process = () => {
        const beamCounts = [0, 0];
        while (beamQueue.length > 0) {
            const {beam, dest, from} = beamQueue.shift();

            for (const d of dest.split(', ')) {
                ++beamCounts[beam === LO ? 0 : 1];

                const known = d in modules;
                // const note = known ? '' : '(unknown)';

                // console.info(`${from} ${beam}> ${dest} ${note}`);
                if (known) {
                    const output = modules[d](beam, from);

                    if (output) {
                        beamQueue.push(output);
                    }
                }
            }
        }
        return beamCounts;
    };

    for (const spec of moduleSpecs) {
        const [name, module] = buildModuleFromSpec(spec);

        modules[name] = module;
    }
    /// Set up conjunction inputs
    for (const spec of moduleSpecs) {
        const [type, name, dest] = parseSpec(spec);

        for (const d of dest.split(', ')) {
            if (!(d in modules)) {
                continue;
            }
            if ('inputs' in modules[d]) {
                modules[d].inputs[name] = LO;
            }
        }
    }

    return {modules, beamQueue, process, state};
}

function buildModuleFromSpec(spec) {
    const [type, name, dest] = parseSpec(spec);

    if (type === undefined) {
        return ['broadcaster', broadcaster(dest, name)];
    }
    if (type === '%') {
        return [name, flipFlop(dest, name)];
    }
    if (type === '&') {
        return [name, conjunction(dest, name)];
    }
    console.warn('TYPE is', type);
    return [];
}

function parseSpec(spec) {
    return spec.match(/(\W)?(\w+) -> (.*)/).slice(1);
}

function broadcaster(dest, name) {
    console.info('Broadcaster dest', dest);
    return function (beam) {
        return {
            beam,
            dest, 
            from: name
        };
    }
}

function flipFlop(dest, name) {
    const result = function(beam) {
        if (beam === HI) { return ; }
        result.state = !result.state;
        return {
            beam: result.state ? HI : LO,
            dest, 
            from: name
        }
    }
    result.state = false;

    return result;
}

function conjunction(dest, name) {
    const result = function(beam, from) {
        result.inputs[from] = beam;
        const remembered = Object.values(result.inputs);
        return {
            beam: remembered.every(r => r === HI) ? LO : HI,
            dest, 
            from: name
        };
    };
    result.inputs = {};

    return result;
}

function buildState(modules) {
    return Reflect.ownKeys(modules)
    .map(k => {
        const m = modules[k];

        if ('state' in m) {
            return {[k]: m.state};
        }
        if ('inputs' in m) {
             return {[k]: m.inputs};
        }
    }).reduce((a, b) => ({
        ...a, ...b
    }), {});
}