import {
    allPermutationsWith0to4,
    allPermutationsWith5to9,
    executeCommandSeq,
    executeCommandSeq$,
    findMaxOutSignal,
    generateInput,
    newOutSignal,
    outputSignal,
    outputSignalFeedbackMode,
    parseInstruction
} from './int-code';
import {readFileAsLines} from "../utils/input";
import {Observable, Subject} from "rxjs";

describe('Int Code Day 7', () => {
    it('should compute the given test commands', () => {
        expect(executeCommandSeq([1, 0, 0, 0, 99])[0]).toEqual([2, 0, 0, 0, 99]);
        expect(executeCommandSeq([2, 3, 0, 3, 99])[0]).toEqual([2, 3, 0, 6, 99]);
        expect(executeCommandSeq([1, 1, 1, 4, 99, 5, 6, 0, 99])[0]).toEqual([30, 1, 1, 4, 2, 5, 6, 0, 99]);
        expect(executeCommandSeq([2, 4, 4, 5, 99, 0])[0]).toEqual([2, 4, 4, 5, 99, 9801]);
        expect(executeCommandSeq([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50])[0]).toEqual([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    });

    it('should parse instruction', () => {

        const res1 = parseInstruction(11001);
        expect(res1).toEqual(expect.objectContaining({
            opcode: 1,
            length: 4,
            modes: [true, true, false],
        }));
        expect(res1.operation(2, 3)).toEqual(5);

        const res2 = parseInstruction(1002);
        expect(res2).toEqual(expect.objectContaining({
            opcode: 2,
            length: 4,
            modes: [false, true, false],
        }));
        expect(res2.operation(2, 3)).toEqual(6);

        const res3 = parseInstruction(11003);
        expect(res3).toEqual(expect.objectContaining({
            opcode: 3,
            length: 2,
            modes: [true, true, false],
        }));


        const res4 = parseInstruction(11004);
        expect(res4).toEqual(expect.objectContaining({
            opcode: 4,
            length: 2,
            modes: [true, true, false],
        }));
        expect(res4.operation(4)).toEqual(4);

        const res5 = parseInstruction(11005);
        expect(res5).toEqual(expect.objectContaining({
            opcode: 5,
            length: 3,
            modes: [true, true, false],
        }));
        expect(res5.jump(4)).toBeTruthy();
        expect(res5.jump(0)).toBeFalsy();

        const res6 = parseInstruction(11006);
        expect(res6).toEqual(expect.objectContaining({
            opcode: 6,
            length: 3,
            modes: [true, true, false],
        }));
        expect(res6.jump(0)).toBeTruthy();
        expect(res6.jump(2)).toBeFalsy();

        const res7 = parseInstruction(11007);
        expect(res7).toEqual(expect.objectContaining({
            opcode: 7,
            length: 4,
            modes: [true, true, false],
        }));
        expect(res7.operation(2, 4)).toEqual(1);
        expect(res7.operation(32, 4)).toEqual(0);

        const res8 = parseInstruction(11008);
        expect(res8).toEqual(expect.objectContaining({
            opcode: 8,
            length: 4,
            modes: [true, true, false],
        }));
        expect(res8.operation(2, 2)).toEqual(1)
        expect(res8.operation(2, 22)).toEqual(0)


    });

    it('should compute the new given test commands', () => {
        expect(executeCommandSeq([1002, 4, 3, 4, 33])[0]).toEqual([1002, 4, 3, 4, 99]);
        expect(executeCommandSeq([1101, 100, -1, 4, 0])[0]).toEqual([1101, 100, -1, 4, 99]);
        expect(executeCommandSeq([3, 11, 1, 11, 6, 6, 1100, 12, 1, 9, 99, 10])[0]).toEqual([3, 11, 1, 11, 6, 6, 1101, 12, 1, 13, 99, 1]);
    });

    it('should output the tests', () => {
        let [, output] = executeCommandSeq([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], [8]);
        expect(output[0]).toEqual(1);
        [, output] = executeCommandSeq([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], [5]);
        expect(output[0]).toEqual(0);

        [, output] = executeCommandSeq([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], [7]);
        expect(output[0]).toEqual(1);
        [, output] = executeCommandSeq([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], [8]);
        expect(output[0]).toEqual(0);

        [, output] = executeCommandSeq([3, 3, 1108, -1, 8, 3, 4, 3, 99], [8]);
        expect(output[0]).toEqual(1);
        [, output] = executeCommandSeq([3, 3, 1108, -1, 8, 3, 4, 3, 99], [5]);
        expect(output[0]).toEqual(0);

        [, output] = executeCommandSeq([3, 3, 1107, -1, 8, 3, 4, 3, 99], [7]);
        expect(output[0]).toEqual(1);
        [, output] = executeCommandSeq([3, 3, 1107, -1, 8, 3, 4, 3, 99], [8]);
        expect(output[0]).toEqual(0);

        [, output] = executeCommandSeq([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], [0]);
        expect(output[0]).toEqual(0);
        [, output] = executeCommandSeq([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], [890]);
        expect(output[0]).toEqual(1);
    });

    it('should output the large tests (part 2)', () => {
        const large8ex = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
            1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
            999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
        let [, output] = executeCommandSeq(large8ex, [7]);
        expect(output[0]).toEqual(999);
        [, output] = executeCommandSeq(large8ex, [8]);
        expect(output[0]).toEqual(1000);
        [, output] = executeCommandSeq(large8ex, [9]);
        expect(output[0]).toEqual(1001);
    });

    it('should generate inputs', () => {
        const input = generateInput([1, 2, 3]);
        expect(input.next().value).toEqual(1);
        expect(input.next().value).toEqual(2);
        expect(input.next().value).toEqual(3);
        expect(input.next().value).toEqual(0);
        expect(input.next().value).toEqual(0);
        expect(input.next().value).toEqual(0);

        const emptyInput = generateInput([]);
        expect(emptyInput.next().value).toEqual(0);
    });


    it('should output to thrusters with given test data', () => {
        const commands1 = '3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0';
        expect(outputSignal([4, 3, 2, 1, 0], commands1)[0]).toEqual(43210);

        // const commands2 = '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0';
        // expect(outputSignal([0, 1, 2, 3, 4], commands2)[0]).toEqual(54321);
        //
        // const commands3 = '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0';
        // expect(outputSignal([1, 0, 4, 3, 2], commands3)[0]).toEqual(65210);
    });

    it('should output the tests - Rx impl', done => {
        const input1: Subject<number> = new Subject();
        const input1$: Observable<number> = input1.asObservable();
        const output: Subject<number> = new Subject();
        const output$: Observable<number> = output.asObservable();
        output$.subscribe(value => {
            expect(value).toEqual(1);
            done();
        });
        input1$.subscribe(value => console.log('input ', value));
        executeCommandSeq$([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], input1$, output);
        input1.next(8);

        // [, output] = executeCommandSeq([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], [5]);
        // expect(output[0]).toEqual(0);
        //
        // [, output] = executeCommandSeq([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], [7]);
        // expect(output[0]).toEqual(1);
        // [, output] = executeCommandSeq([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], [8]);
        // expect(output[0]).toEqual(0);
        //
        // [, output] = executeCommandSeq([3, 3, 1108, -1, 8, 3, 4, 3, 99], [8]);
        // expect(output[0]).toEqual(1);
        // [, output] = executeCommandSeq([3, 3, 1108, -1, 8, 3, 4, 3, 99], [5]);
        // expect(output[0]).toEqual(0);
        //
        // [, output] = executeCommandSeq([3, 3, 1107, -1, 8, 3, 4, 3, 99], [7]);
        // expect(output[0]).toEqual(1);
        // [, output] = executeCommandSeq([3, 3, 1107, -1, 8, 3, 4, 3, 99], [8]);
        // expect(output[0]).toEqual(0);
        //
        // [, output] = executeCommandSeq([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], [0]);
        // expect(output[0]).toEqual(0);
        // [, output] = executeCommandSeq([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], [890]);
        // expect(output[0]).toEqual(1);
        setTimeout(() => {
            done.fail();
        }, 1000);
    });

    it('should output to thrusters with given test data - Rx impl', async () => {
        const commands1 = '3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0';
        const res1 = await newOutSignal([4, 3, 2, 1, 0], commands1);
        expect(res1).toEqual(43210);

        // const commands2 = '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0';
        // expect(outputSignal([0, 1, 2, 3, 4], commands2)[0]).toEqual(54321);
        //
        // const commands3 = '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0';
        // expect(outputSignal([1, 0, 4, 3, 2], commands3)[0]).toEqual(65210);
    });


    it('should find all permutations', () => {
        const res = allPermutationsWith0to4();
        expect(res).toHaveLength(120);

        const res2 = allPermutationsWith5to9();
        expect(res2).toHaveLength(120);

    });

    it('should find the max output to thrusters', () => {
        const [commands] = readFileAsLines('day7/input.txt');
        expect(findMaxOutSignal(commands)).toEqual(99376);
    });

    it('should output to thrusters with feedback mode with given test data', () => {
        const commands1 = '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5';
        expect(outputSignalFeedbackMode([9, 8, 7, 6, 5], commands1)[0]).toEqual(139629729);
    });
});