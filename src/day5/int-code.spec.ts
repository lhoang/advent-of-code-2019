import {compute, executeCommandSeq, parseInstruction} from './int-code';

describe('Int Code Day 5', () => {
    it('should compute the given test commands', () => {
        expect(executeCommandSeq([1, 0, 0, 0, 99])).toEqual([2, 0, 0, 0, 99]);
        expect(executeCommandSeq([2, 3, 0, 3, 99])).toEqual([2, 3, 0, 6, 99]);
        expect(executeCommandSeq([1, 1, 1, 4, 99, 5, 6, 0, 99])).toEqual([30, 1, 1, 4, 2, 5, 6, 0, 99]);
        expect(executeCommandSeq([2, 4, 4, 5, 99, 0])).toEqual([2, 4, 4, 5, 99, 9801]);
        expect(executeCommandSeq([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50])).toEqual([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    });

    it('should parse instruction', () => {
        const res = parseInstruction(1002);
        expect(res).toEqual(expect.objectContaining({
            opcode: 2,
            length: 4,
            modes: [false, true, false],
        }));
        expect(res.operation(2, 3)).toEqual(6);

        const res2 = parseInstruction(11001);
        expect(res2).toEqual(expect.objectContaining({
            opcode: 1,
            length: 4,
            modes: [true, true, false],
        }));
        expect(res2.operation(2, 3)).toEqual(5);

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
});