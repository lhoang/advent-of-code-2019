import {readFileAsLines} from "../utils/input";
import intersect from "fast_array_intersect/lib";

export function parseInputToMap(file: string): Map<string, string> {
    return new Map(readFileAsLines(file)
        .filter(v => v)
        .map(link => link.split(')'))
        .map(([parent, name]) => [name, parent] as [string, string]));
}

export function findOrbitsFor(astra: string, map: Map<string, string>): Array<string> {
    const recCount = (acc: Array<string>, current: string): Array<string> =>
        current == 'COM'
            ? [...acc, current]
            : recCount([...acc, current], map.get(current));
    return recCount([], astra);
}

export function countTotalOrbits(map: Map<string, string>) {
    return Array.from(map.keys())
        .map(astra => findOrbitsFor(astra, map).length - 1)
        .reduce((a, b) => a + b);
}

export function countOrbitalTranfers(from: string, to: string, map: Map<string, string>) {
    const orbitsFrom = findOrbitsFor(from, map);
    const orbitsTo = findOrbitsFor(to, map);
    const intersection = intersect([orbitsFrom, orbitsTo]);
    if (intersection.length < 1) {
        throw new Error('Transfer impossible');
    }
    const pivotOrbit = intersection[0];
    const path = [
        ...orbitsFrom.slice(1, orbitsFrom.indexOf(pivotOrbit)),
        ...orbitsTo.slice(1, orbitsTo.indexOf(pivotOrbit)).reverse()
    ];
    return path.length;
}