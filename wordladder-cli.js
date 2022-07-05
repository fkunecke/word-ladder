const util = require('util');

const wl = require('./wordladder.js');

// Main entrypoint for command-line interface.
function cli(args) {
    if (args.length < 1) {
        console.error(`Need args: need at least 1. got = ${args.length}`);
        return;
    }
    let [cmd, ...vargs] = args;
    try {
        switch (cmd) {
            case 'generate':
                // generateLadder(vargs);
                newGenerate(vargs);
                break;
            case 'solve':
                solveLadder(vargs);
                break;
            default:
                throw new WlError(
                    `Invald command '${cmd}'. available are ['generate', 'solve']`);
        }
    } catch (e) {
        console.error(e instanceof WlError ? e.message : e);
    }
}

// validate args and call word ladder generate, print results if successful
function generateLadder(args) {
    // let start = validWord(args.length === 1 ? args[0] : wl.randomWord());
    let wordLength = Number(args[0]);
    let wordDepth = Number(args[1]);
    console.log(`${wordLength} ${wordDepth}`)
    let words = wl.getDict(wordLength);
    let start = wl.randomWord(wordLength);
    let puzzle = wl.generate(start, wordDepth, words);
    if (puzzle.length === 0) {
        throw new WlError(`Could not find a generate a puzzle for start: ${start}`)
    }
    console.log(puzzle);
    console.log(fmtGenerated(puzzle));
}

// validate args and call word ladder solve, print results if successful
function solveLadder(args) {
    if (args.length < 2) {
        throw new WlError(`Not enough args for solver. got=${args.length} want=2`)
    }
    let wordLength = args[0].length;
    let words = wl.getDict(wordLength);
    let [start, end] = [validWord(args[0], words), validWord(args[1], words)];

    var solution;
    for (let i = 4; i < 20; i++) {
        solution = wl.solve(start, end, i, words);
        i > 7 && console.log(`trying solution of length ${i}...`);
        if (solution.length > 0) {
            console.log(`found optimal solution of length ${i}`);
            break;
        }
    }
    if (solution.length === 0) {
        throw new WlError(`Could not find a solution for ${start} to ${end}`)
    }
    console.log(fmtSolution(solution));
}

// validate args and call word ladder solve, print results if successful
function newGenerate(args) {
    if (args.length < 1) {
        throw new WlError(`Not enough args for solver. got=${args.length} want=2`)
    }
    let wordLength = Number(args[0]);
    let words = wl.getDict(wordLength);
    let start = wl.randomWord(wordLength);
    let end = wl.randomWord(wordLength);

    var solution;
    for (let i = 4; i < 15; i++) {
        solution = wl.solve(start, end, i, words);
        i > 7 && console.log(`trying solution of length ${i}...`);
        if (solution.length > 0) {
            console.log(`found optimal solution of length ${i}`);
            break;
        }
    }
    if (solution.length === 0) {
        throw new WlError(`Could not find a solution for ${start} to ${end}`)
    }
    console.log(fmtSolution(solution));
}

function validWord(word, words) {
    // if (word.length !== 4) {
    //     throw new WlError(
    //         `All words should be 4 letters long. ${word} has ${word.length} letters`);
    // }
    if (!words.has(word)) {
        throw new WlError(`${word} is not a valid word in our dictionary`)
    }
    return word.toLowerCase();
}

function fmtSolution(words) {
    return util.format('\b' + ladder.repeat(words.length), ...words).toUpperCase();
}

function fmtGenerated(words) {
    return util.format('\b' 
        + ladder 
        + ladderBlank.repeat(words.length-2)
        + ladder,
        words[0], words[words.length-1]).toUpperCase();
}

// InternalError for custom error handling.
class WlError extends Error {};

const ladder = '\n║ %s ║\n╠══════╣';
const ladderBlank = util.format(ladder, '    ');

cli(process.argv.slice(2));
