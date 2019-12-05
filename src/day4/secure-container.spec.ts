import {
    containsDouble,
    findAllPossiblePasswords,
    findAllPossiblePasswordsWithOneDouble,
    hasAdjacentNumbers,
    onlyIncrease,
    range
} from "./secure-container";

describe('Secure Container', () => {
    it('should find adjacent numbers', () => {
        expect(hasAdjacentNumbers('111345')).toBeTruthy();
        expect(hasAdjacentNumbers('102344')).toBeTruthy();
        expect(hasAdjacentNumbers('102245')).toBeTruthy();
        expect(hasAdjacentNumbers('102345')).toBeFalsy();
    });

    it('should find only increasing sequence', () => {
        expect(onlyIncrease('123456')).toBeTruthy();
        expect(onlyIncrease('122456')).toBeTruthy();
        expect(onlyIncrease('111111')).toBeTruthy();
        expect(onlyIncrease('121111')).toBeFalsy();
        expect(onlyIncrease('123450')).toBeFalsy();
    });

    it('should generate range', () => {
        expect(range(2, 5)).toEqual([2, 3, 4, 5]);
    });

    it('should generate all possible passwords', () => {
        const res = findAllPossiblePasswords(147981, 691423);
        expect(res.length).toEqual(1790);
    });

    it('should contains 1 double', () => {
        expect(containsDouble('119599')).toBeTruthy();
        expect(containsDouble('111699')).toBeTruthy();
        expect(containsDouble('111133')).toBeTruthy();
        expect(containsDouble('112233')).toBeTruthy();
        expect(containsDouble('111122')).toBeTruthy();

        expect(containsDouble('111134')).toBeFalsy();
        expect(containsDouble('111113')).toBeFalsy();
        expect(containsDouble('341113')).toBeFalsy();
        expect(containsDouble('111111')).toBeFalsy();
        expect(containsDouble('123444')).toBeFalsy();
        expect(containsDouble('144441')).toBeFalsy();
        expect(containsDouble('111444')).toBeFalsy();

    });

    it('should generate all possible passwords with one double', () => {
        const res = findAllPossiblePasswordsWithOneDouble(147981, 691423);
        expect(res.length).toEqual(1206);
    });
});