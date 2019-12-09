/**
 * https://adventofcode.com/2019/day/7
 */
import {range, readFileAsLines} from "../utils/input";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Amp} from "../day5/Amp";

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
            operation = (a: number) => {
                console.log('wait input');
                return a;
            };
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

    const generatedInput: IterableIterator<number | number> = generateInput(input);
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

export async function executeCommandSeq$(intCommands: Array<number>,
                                         input$: Observable<number>,
                                         output: Subject<number>,
                                         debug: boolean = false)
    : Promise<Array<number>> {

    let i = 0, length = 4;
    // const output: BehaviorSubject<number> = new BehaviorSubject(0);
    // const output$: Observable<number> = output.asObservable();
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
        const asyncInput = async (a: Observable<number>) => {
            let waiting = true;
            let res: number;
            console.log('wait');
            a.subscribe(v => {
                res = v;
                console.log(v);
                waiting = false;
            });
            while (waiting) {

            }
            waiting = true;
            return res;
        };


        switch (opcode) {
            case 1:
            case 2:
            case 7:
            case 8:
                intCommands[position] = operation(input1, input2);
                break;
            case 3:
                intCommands[position] = await asyncInput(input$);
                break;
            case 4:
                output.next(operation(input1));
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
    return intCommands;
}

export function compute(file: string, input: number) {
    const [commands] = readFileAsLines('file');
    executeCommandSeq(parse(commands), [input]);
}


export function* generateInput(init: Array<number> = []) {
    yield* init;
    while (true) yield 0;
}

export function* generateSingleInput(init: Array<number> = []) {
    yield* init;
    yield 0;
}

export function outputSignal(sequence: Array<number>, commands: string): Array<number> {
    const commandSeq = parse(commands);
    const [, outputAmpA] = executeCommandSeq(commandSeq, [sequence[0]]);
    const [, outputAmpB] = executeCommandSeq(commandSeq, [sequence[1], ...outputAmpA]);
    const [, outputAmpC] = executeCommandSeq(commandSeq, [sequence[2], ...outputAmpB]);
    const [, outputAmpD] = executeCommandSeq(commandSeq, [sequence[3], ...outputAmpC]);
    const [end, outputAmpE] = executeCommandSeq(commandSeq, [sequence[4], ...outputAmpD]);
    console.log(end);
    return outputAmpE;
}

export async function newOutSignal(sequence: Array<number>, commands: string) {
    const commandSeq = parse(commands);
    const inputA: BehaviorSubject<number> = new BehaviorSubject(sequence[0]);
    const inputA$: Observable<number> = inputA.asObservable();
    const inputB: BehaviorSubject<number> = new BehaviorSubject(sequence[1]);
    const inputB$: Observable<number> = inputB.asObservable();
    const inputC: BehaviorSubject<number> = new BehaviorSubject(sequence[2]);
    const inputC$: Observable<number> = inputC.asObservable();
    const inputD: BehaviorSubject<number> = new BehaviorSubject(sequence[3]);
    const inputD$: Observable<number> = inputD.asObservable();
    const inputE: BehaviorSubject<number> = new BehaviorSubject(sequence[4]);
    const inputE$: Observable<number> = inputE.asObservable();

    // Wiring amps
    const ampA = new Amp("AmpA", commandSeq, inputA$);
    const outputA$ = ampA.getOutput$();
    const ampB = new Amp("AmpB", commandSeq, inputB$);
    const outputB$ = ampB.getOutput$();
    const ampC = new Amp("AmpC", commandSeq, inputC$);
    const outputC$ = ampC.getOutput$();
    const ampD = new Amp("AmpD", commandSeq, inputD$);
    const outputD$ = ampD.getOutput$();
    const ampE = new Amp("AmpE", commandSeq, inputE$);
    const outputE$ = ampE.getOutput$();

    // init


    inputA$.subscribe(v => console.log('Input A :', v));
    inputB$.subscribe(v => console.log('Input B :', v));
    executeCommandSeq$(commandSeq, inputA$, inputB);
    executeCommandSeq$(commandSeq, inputB$, inputC);
    executeCommandSeq$(commandSeq, inputC$, inputD);
    executeCommandSeq$(commandSeq, inputD$, inputE);
    const res = await executeCommandSeq$(commandSeq, inputE$, inputA);
    console.log('res', res);
    return res;
}

export function allPermutationsWith0to4(): Array<Array<number>> {
    const pattern0to4 = /^(?:([01234])(?!\d*?\1)){5}$/;
    return allPermutations(pattern0to4, 0, 43210);
}

export function allPermutationsWith5to9(): Array<Array<number>> {
    const pattern5to9 = /^(?:([56789])(?!\d*?\1)){5}$/;
    return allPermutations(pattern5to9, 56789, 98765);
}

export function allPermutations(pattern: RegExp, from: number, to: number): Array<Array<number>> {
    return range(from, to)
        .map(n => String(n).padStart(5, '0'))
        .filter(n => pattern.test(n))
        .map(n => n.split('')
            .map(v => +v)
        );
}

export function findMaxOutSignal(commands: string): number {
    return allPermutationsWith0to4()
        .map(seq => outputSignal(seq, commands))
        .map(res => res[0])
        .reduce((a, b) => Math.max(a, b));
}


export function outputSignalFeedbackMode(sequence: Array<number>, commands: string): number {
    // init loop
    let outputAmpE = outputSignal(sequence, commands);
    console.log(outputAmpE[0]);
    // feedback loop
    let running = true;
    let res = 0;
    const commandSeq = parse(commands);
    while (running) {
        const [, outputAmpA] = executeCommandSeq(commandSeq, outputAmpE);
        const [, outputAmpB] = executeCommandSeq(commandSeq, outputAmpA);
        const [, outputAmpC] = executeCommandSeq(commandSeq, outputAmpB);
        const [, outputAmpD] = executeCommandSeq(commandSeq, outputAmpC);
        [, outputAmpE] = executeCommandSeq(commandSeq, outputAmpD);
        console.log(outputAmpE[0]);
        running = outputAmpE.length > 1;
    }
    return outputAmpE[0];
}

export function findMaxOutSignalFeedbackMode(commands: string): number {
    return 0;
}