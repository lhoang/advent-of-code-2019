import {compute, executeCommandSeq, parseInstruction} from './int-code';

describe('Int Code Day 5', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should compute the given test commands', () => {
        expect(executeCommandSeq([1, 0, 0, 0, 99])).toEqual([2, 0, 0, 0, 99]);
        expect(executeCommandSeq([2, 3, 0, 3, 99])).toEqual([2, 3, 0, 6, 99]);
        expect(executeCommandSeq([1, 1, 1, 4, 99, 5, 6, 0, 99])).toEqual([30, 1, 1, 4, 2, 5, 6, 0, 99]);
        expect(executeCommandSeq([2, 4, 4, 5, 99, 0])).toEqual([2, 4, 4, 5, 99, 9801]);
        expect(executeCommandSeq([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50])).toEqual([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
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
        expect(res3.operation(2)).toEqual(2);

        const spy = jest.spyOn(global.console, 'log');
        const res4 = parseInstruction(11004);
        expect(res4).toEqual(expect.objectContaining({
            opcode: 4,
            length: 2,
            modes: [true, true, false],
        }));
        res4.operation(4);
        expect(spy).toHaveBeenCalledWith(4);

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
        expect(executeCommandSeq([1002, 4, 3, 4, 33])).toEqual([1002, 4, 3, 4, 99]);
        expect(executeCommandSeq([1101, 100, -1, 4, 0])).toEqual([1101, 100, -1, 4, 99]);
        expect(executeCommandSeq([3, 11, 1, 11, 6, 6, 1100, 12, 1, 9, 99, 10], 1)).toEqual([3, 11, 1, 11, 6, 6, 1101, 12, 1, 13, 99, 1]);
    });

    it('should print the diagnostic', () => {
        const spy = jest.spyOn(global.console, 'log');
        compute(1);
        expect(spy).toBeCalledTimes(10);
        expect(spy).toHaveBeenNthCalledWith(9, 0);
        expect(spy).toHaveBeenLastCalledWith(13346482);
    });

    it('should output the tests (part 2)', () => {
        const spy = jest.spyOn(global.console, 'log');
        executeCommandSeq([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 8);
        expect(spy).toHaveBeenLastCalledWith(1);
        executeCommandSeq([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 5);
        expect(spy).toHaveBeenLastCalledWith(0);

        executeCommandSeq([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], 7);
        expect(spy).toHaveBeenLastCalledWith(1);
        executeCommandSeq([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], 8);
        expect(spy).toHaveBeenLastCalledWith(0);

        executeCommandSeq([3, 3, 1108, -1, 8, 3, 4, 3, 99], 8);
        expect(spy).toHaveBeenLastCalledWith(1);
        executeCommandSeq([3, 3, 1108, -1, 8, 3, 4, 3, 99], 5);
        expect(spy).toHaveBeenLastCalledWith(0);

        executeCommandSeq([3, 3, 1107, -1, 8, 3, 4, 3, 99], 7);
        expect(spy).toHaveBeenLastCalledWith(1);
        executeCommandSeq([3, 3, 1107, -1, 8, 3, 4, 3, 99], 8);
        expect(spy).toHaveBeenLastCalledWith(0);

        executeCommandSeq([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], 0,);
        expect(spy).toHaveBeenLastCalledWith(0);
        executeCommandSeq([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], 890,);
        expect(spy).toHaveBeenLastCalledWith(1);


    });

    it('should output the large tests (part 2)', () => {

        const spy = jest.spyOn(global.console, 'log');
        const large8ex = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
            1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
            999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];

        executeCommandSeq(large8ex, 7);
        expect(spy).toHaveBeenLastCalledWith(999);
        executeCommandSeq(large8ex, 8);
        expect(spy).toHaveBeenLastCalledWith(1000);
        executeCommandSeq(large8ex, 9);
        expect(spy).toHaveBeenLastCalledWith(1001);
    });


    it('should print the diagnostic for part 2', () => {
        const spy = jest.spyOn(global.console, 'log');
        compute(5);
        expect(spy).toHaveBeenLastCalledWith(12111395);
    });
});