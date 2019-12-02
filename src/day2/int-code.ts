function parse(command: string): Array<number> {
  return command.split(',')
    .map(v => +v);
}

export function compute(command: string) {
  const intCommands: Array<number> = parse(command);
  for (let i = 0; intCommands[i] != 99 && i < intCommands.length; i+= 4) {
    const op = intCommands[i];
    const input1 = intCommands[intCommands[i+1]];
    const input2 = intCommands[intCommands[i+2]];
    const position = intCommands[i+3];

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
  return intCommands.join(',');
}