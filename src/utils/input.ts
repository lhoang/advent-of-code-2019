import * as fs from 'fs';
import * as path from 'path';

export function readFileAsLines(filename: string): Array<string> {
    return fs.readFileSync(path.resolve(__dirname, '..', filename), {encoding: 'UTF-8'}).split('\n');
}