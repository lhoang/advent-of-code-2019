import {range} from "../utils/input";

const adjacentNumberPattern = /(\d)\1/;

export function hasAdjacentNumbers(n: string): boolean {
    return adjacentNumberPattern.test(n);
}

const repeatingNumbersPattern = /(\d)\1{2,}/g;

export function containsDouble(n: string): boolean {
    const reduced = n.replace(repeatingNumbersPattern, 'x');
    return hasAdjacentNumbers(reduced);
}

const increasingPattern = /^1*2*3*4*5*6*7*8*9*$/;

export function onlyIncrease(n: string): boolean {
    return increasingPattern.test(n);
}

export function findAllPossiblePasswords(start: number, end: number): Array<string> {
    return range(start, end)
        .map(v => v.toString())
        .filter(hasAdjacentNumbers)
        .filter(onlyIncrease);
}

export function findAllPossiblePasswordsWithOneDouble(start: number, end: number): Array<string> {
    return range(start, end)
        .map(v => v.toString())
        .filter(containsDouble)
        .filter(onlyIncrease);
}