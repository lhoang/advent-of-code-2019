/**
 * https://adventofcode.com/2019/day/7
 */
import {range, readFileAsLines} from "../utils/input";

function parse(command: string): Array<number> {
    return command.split(',')
        .map(v => +v);
}

export interface Instruction {
    opcode: number,
    operation?: ((a: number, b?: number) => number);
    jump?: (a: number) => boolean;
    length: number;
    modes: Array<boolean>;
}

export function parseInstruction(instruction: number): Instruction {
    const padded = String(instruction).padStart(5, '0');
    const modes = padded.slice(0, 3)
        .split('')
        .map(v => !!+v);
    const opcode = +padded.slice(3);

    let length = 4;
    let operation;
    let jump;
    switch (opcode) {
        case 1:
            operation = (a: number, b: number) => a + b;
            break;
        case 2:
            operation = (a: number, b: number) => a * b;
            break;
        case 3:
            operation = (a: number) => a;
            length = 2;
            break;
        case 4:
            operation = (a: number) => a;
            length = 2;
            break;
        case 5:
            jump = (a: number) => a != 0;
            length = 3;
            break;
        case 6:
            jump = (a: number) => a == 0;
            length = 3;
            break;
        case 7:
            operation = (a: number, b: number) => +(a < b);
            break;
        case 8:
            operation = (a: number, b: number) => +(a == b);
            break;

        default:
        // nothing
    }
    return {
        opcode,
        operation,
        jump,
        length,
        modes,
    };
}

export function executeCommandSeq(intCommands: Array<number>,
                                  //input: number = 1,
                                  input: Array<number> = [1],
                                  debug: boolean = false)
    : [Array<number>, Array<number>] {

    const generatedInput = generateInput(input);
    let i = 0, length = 4;
    const output: Array<number> = [];
    while (intCommands[i] != 99 && i < intCommands.length) {
        const {
            opcode,
            operation,
            jump,
            length: newLength,
            modes,
        } = parseInstruction(intCommands[i]);
        length = newLength;

        const input1 = modes[2]
            ? intCommands[i + 1]
            : intCommands[intCommands[i + 1]];
        const input2 = modes[1]
            ? intCommands[i + 2]
            : intCommands[intCommands[i + 2]];
        const position = length == 2
            ? modes[2]
                ? i + 1
                : intCommands[i + 1]
            : modes[0]
                ? i + 3
                : intCommands[i + 3];
        if (debug) {
            console.debug({
                index: i,
                opcode,
                input1,
                input2,
                position,
                modes,
            });
        }

        let doTheJump = false;
        switch (opcode) {
            case 1:
            case 2:
            case 7:
            case 8:
                intCommands[position] = operation(input1, input2);
                break;
            case 3:
                intCommands[position] = operation(generatedInput.next().value as number);
                break;
            case 4:
                output.push(operation(input1));
                break;
            case 5:
            case 6:
                doTheJump = jump(input1);
                break;
            default:
            // nothing
        }

        // for the next loop
        if (doTheJump) {
            i = input2;
        } else {
            i += length;
        }
        if (debug) {
            console.debug(intCommands);
        }
    }
    return [intCommands, output];
}

export function compute(file: string, input: number) {
    const [commands] = readFileAsLines('file');
    executeCommandSeq(parse(commands), [input]);
}


export function* generateInput(init: Array<number> = []) {
    yield* init;
    while (true) yield 0;
}

export function outputSignal(sequence: Array<number>, commands: string): number {
    const [, outputAmpA] = executeCommandSeq(parse(commands), [sequence[0]]);
    const [, outputAmpB] = executeCommandSeq(parse(commands), [sequence[1], ...outputAmpA]);
    const [, outputAmpC] = executeCommandSeq(parse(commands), [sequence[2], ...outputAmpB]);
    const [, outputAmpD] = executeCommandSeq(parse(commands), [sequence[3], ...outputAmpC]);
    const [, outputAmpE] = executeCommandSeq(parse(commands), [sequence[4], ...outputAmpD]);
    return outputAmpE[0];
}

const pattern0to4 = /^(?:([01234])(?!\d*?\1)){5}$/;

export function allPermutationsWith0to4(): Array<Array<number>> {
    return range(0, 43210)
        .map(n => String(n).padStart(5, '0'))
        .filter(n => pattern0to4.test(n))
        .map(n => n.split('')
            .map(v => +v)
        );
}

export function findMaxOutSignal(commands: string): number {
    return allPermutationsWith0to4()
        .map(seq => outputSignal(seq, commands))
        .reduce((a, b) => Math.max(a, b));
}