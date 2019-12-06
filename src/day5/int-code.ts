/**
 * https://adventofcode.com/2019/day/5
 */
import {readFileAsLines} from "../utils/input";

function parse(command: string): Array<number> {
    return command.split(',')
        .map(v => +v);
}

export interface Instruction {
    opcode: number,
  operation?: ((a: number, b?: number) => number | void);
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
            operation = (a: number) => console.log(a);
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

export function executeCommandSeq(intCommands: Array<number>, input: number = 1, debug: boolean = false): Array<number> {
    let i = 0, length = 4;
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
          intCommands[position] = operation(input1, input2) as number;
          break;
        case 3:
          intCommands[position] = operation(input) as number;
          break;
        case 4:
          operation(input1);
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

export function compute(input: number) {
    const [commands] = readFileAsLines('day5/input.txt');
    executeCommandSeq(parse(commands), input);
}