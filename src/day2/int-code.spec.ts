import {compute, executeCommandSeq, findNounVerbForOuput} from './int-code';

describe('Int Code', () => {
  it('should compute the given test commands', () => {
    expect(executeCommandSeq([1, 0, 0, 0, 99])).toEqual([2, 0, 0, 0, 99]);
    expect(executeCommandSeq([2, 3, 0, 3, 99])).toEqual([2, 3, 0, 6, 99]);
    expect(executeCommandSeq([1, 1, 1, 4, 99, 5, 6, 0, 99])).toEqual([30, 1, 1, 4, 2, 5, 6, 0, 99]);
    expect(executeCommandSeq([2, 4, 4, 5, 99, 0])).toEqual([2, 4, 4, 5, 99, 9801]);
    expect(executeCommandSeq([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50])).toEqual([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
  });

  it('should compute the right result before 1202 program alarm', () => {
    expect(compute(12, 2)).toEqual(4945026);
  });

  it('should find noun and verb for output', () => {
    expect(findNounVerbForOuput(19690720)).toEqual([52, 96]);
  });

});