import * as fs from 'fs';

export function readFileAsLines(filename: string): Array<string> {
    return fs.readFileSync(filename, {encoding: 'UTF-8'}).split('\n')
}