import {countOrbitalTranfers, countTotalOrbits, findOrbitsFor, parseInputToMap} from './orbit';

describe('Orbit', () => {
    it('should parse orbit inputs', () => {
        const orbitMap = parseInputToMap('day6/smallInput.txt');
        expect(orbitMap.size).toEqual(11);
        expect(orbitMap.get('B')).toEqual('COM');
        expect(orbitMap.get('H')).toEqual('G');
    });

    it('should count orbits from given test data', () => {
        const orbitMap = parseInputToMap('day6/smallInput.txt');
        expect(findOrbitsFor('D', orbitMap)).toEqual(['D', 'C', 'B', 'COM']);
        expect(findOrbitsFor('L', orbitMap)).toEqual(['L', 'K', 'J', 'E', 'D', 'C', 'B', 'COM']);
        expect(findOrbitsFor('COM', orbitMap)).toEqual(['COM']);
    });

    it('should count the total orbits of given test data', () => {
        const orbitMap = parseInputToMap('day6/smallInput.txt');
        expect(countTotalOrbits(orbitMap)).toEqual(42);
    });

    it('should count the total orbits of the map data', () => {
        const orbitMap = parseInputToMap('day6/input.txt');
        expect(countTotalOrbits(orbitMap)).toEqual(621125);
    });

    it('should count orbital tranfers', () => {
        const orbitMap = parseInputToMap('day6/smallInputTransfers.txt');
        expect(countOrbitalTranfers('YOU', 'SAN', orbitMap)).toEqual(4);
    });

    it('should count orbital tranfers for the map data', () => {
        const orbitMap = parseInputToMap('day6/input.txt');
        expect(countOrbitalTranfers('YOU', 'SAN', orbitMap)).toEqual(550);
    });
});