import {
    computeRequiredFuel,
    computeRequiredFuelWithFuelIncluded,
    computeTotalRequiredFuelWithFuelIncluded
} from "./fuel-requirements";
import {readFileAsLines} from "../utils/input";

describe('Fuel requirements', () => {
    it('should compute the given test masses as single module', () => {
        expect(computeRequiredFuel([12])).toEqual(2);
        expect(computeRequiredFuel([14])).toEqual(2);
        expect(computeRequiredFuel([1969])).toEqual(654);
        expect(computeRequiredFuel([100756])).toEqual(33583);
    });

    it('should the sum of the given test masses', () => {
        expect(computeRequiredFuel([12, 14, 1969, 100756])).toEqual(33583 + 654 + 4);
    });

    it('should compute the fuel requirements for the spacecraft', () => {
        const moduleMasses = readFileAsLines('/Users/lang/IdeaProjects/advent-of-code-2019/src/day1/input.txt')
            .filter(v => v)
            .map(v => +v);

        const computedMass = computeRequiredFuel(moduleMasses);
        console.log('Fuel requirements for the spacecraft: ', computedMass);
        expect(computedMass).toEqual(3429947);
    });


    it('should compute recursively the total fuel including the fuel mass', () => {
        expect(computeRequiredFuelWithFuelIncluded(14)).toEqual(2);
        expect(computeRequiredFuelWithFuelIncluded(1969)).toEqual(966);
        expect(computeRequiredFuelWithFuelIncluded(100756)).toEqual(50346);
    });

    it('should compute recursively the fuel requirements for the spacecraft including the fuel mass', () => {
        const moduleMasses = readFileAsLines('/Users/lang/IdeaProjects/advent-of-code-2019/src/day1/input.txt')
            .filter(v => v)
            .map(v => +v);

        const computedMass = computeTotalRequiredFuelWithFuelIncluded(moduleMasses);
        console.log('Fuel requirements for the spacecraft (fuel inclued): ', computedMass);
        expect(computedMass).toEqual(5142043);
    });
});