/**
 * https://adventofcode.com/2019/day/2
 */

function parse(command: string): Array<number> {
  return command.split(',')
    .map(v => +v);
}

export function executeCommandSeq(intCommands: Array<number>): Array<number> {
  for (let i = 0; intCommands[i] != 99 && i < intCommands.length; i += 4) {
    const op = intCommands[i];
    const input1 = intCommands[intCommands[i + 1]];
    const input2 = intCommands[intCommands[i + 2]];
    const position = intCommands[i + 3];

    switch (op) {
      case 1:
        intCommands[position] = input1 + input2;
        break;
      case 2:
        intCommands[position] = input1 * input2;
        break;
      default:
      // nothing
    }
  }
  return intCommands;
}

export function compute(noun: number, verb: number): number {
  const input = '1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,10,1,19,1,19,5,23,1,23,9,27,2,27,6,31,1,31,6,35,2,35,9,39,1,6,39,' +
    '43,2,10,43,47,1,47,9,51,1,51,6,55,1,55,6,59,2,59,10,63,1,6,63,67,2,6,67,71,1,71,5,75,2,13,75,79,1,10,79,83,1,5,' +
    '83,87,2,87,10,91,1,5,91,95,2,95,6,99,1,99,6,103,2,103,6,107,2,107,9,111,1,111,5,115,1,115,6,119,2,6,119,123,1,5,' +
    '123,127,1,127,13,131,1,2,131,135,1,135,10,0,99,2,14,0,0';

  const arrayInput = parse(input);
  arrayInput[1] = noun;
  arrayInput[2] = verb;
  return executeCommandSeq(arrayInput)[0];
}

export function findNounVerbForOuput(output: number): Array<number> {
  // brut force !
  for (let noun = 0; noun < 101; noun++) {
    for (let verb = 0; verb < 101; verb++) {
      if (compute(noun, verb) === output) {
        return [noun, verb];
      }
    }
  }
  throw 'No result';
}