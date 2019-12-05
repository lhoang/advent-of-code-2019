export function hasAdjacentNumbers(n: string): boolean {
    return /(\d)\1/.test(n);
}

export function containsDouble(n: string): boolean {
    const reduced = n.replace(/(\d)\1{2,}/g, 'x');
    return hasAdjacentNumbers(reduced);
}

export function onlyIncrease(n: string): boolean {
    let res = true;
    let prev = 1;
    for (let i of n.split('').map(v => +v)) {
        res = res && prev <= i;
        prev = i;
    }
    return res;
}

// Generator of range
export function range(start, end): Array<number> {
    return (new Array(end - start + 1)).fill(undefined).map((_, i) => i + start);
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