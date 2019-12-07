import * as fs from 'fs';
import * as path from 'path';

export function readFileAsLines(filename: string): Array<string> {
    return fs.readFileSync(path.resolve(__dirname, '..', filename), {encoding: 'UTF-8'}).split('\n');
}

// Generator of range
export function range(start, end): Array<number> {
    return (new Array(end - start + 1))
        .fill(undefined)
        .map((_, i) => i + start);
}