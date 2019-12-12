import {findBestMonitoringLocation, generateAllSights, isHidden, isOnMap, parse, toSight} from "./monitoring-station";

describe('Monitoring Station', () => {
    it('should tell if a asteroid is on the map', () => {
        expect(isOnMap({x: 0, y: 7}, 10, 10)).toBeTruthy();
        expect(isOnMap({x: -1, y: 7}, 10, 10)).toBeFalsy();
        expect(isOnMap({x: 4, y: 12}, 10, 10)).toBeFalsy();
    });

    it('should find hidden asteroids', () => {
        const existing = [
            {vx: 3, vy: 3},
            {vx: -3, vy: 1},
            {vx: 1, vy: 2},
            {vx: 0, vy: 2},
        ];
        expect(isHidden({vx: 6, vy: 6}, existing)).toBeTruthy();
        expect(isHidden({vx: 8, vy: 8}, existing)).toBeTruthy();
        expect(isHidden({vx: 2, vy: 4}, existing)).toBeTruthy();
        expect(isHidden({vx: -9, vy: 3}, existing)).toBeTruthy();
        expect(isHidden({vx: 0, vy: 3}, existing)).toBeTruthy();


        expect(isHidden({vx: 1, vy: 10}, existing)).toBeFalsy();
        expect(isHidden({vx: 3, vy: -1}, existing)).toBeFalsy();
    });

    it('should transform an asteroid to a sight', () => {
        expect(toSight({x: 2, y: 3}, {x: 1, y: 1})).toEqual({vx: 1, vy: 2, distance: 2.24});
        expect(toSight({x: 2, y: 3}, {x: 0, y: 0})).toEqual({vx: 2, vy: 3, distance: 3.61});
        expect(toSight({x: 2, y: 3}, {x: 4, y: 4})).toEqual({vx: -2, vy: -1, distance: 2.24});
        expect(toSight({x: 1, y: 4}, {x: 4, y: 4})).toEqual({vx: -3, vy: 0, distance: 3});
    });

    it('should parse the small map', () => {
        expect(parse('day10/smallMap.txt')).toEqual([
            {x: 1, y: 0},
            {x: 4, y: 0},
            {x: 0, y: 2},
            {x: 1, y: 2},
            {x: 2, y: 2},
            {x: 3, y: 2},
            {x: 4, y: 2},
            {x: 4, y: 3},
            {x: 3, y: 4},
            {x: 4, y: 4},
        ]);
    });

    it('should find all asteroids in sight', () => {
        const asteroids = parse('day10/smallMap.txt');
        expect(generateAllSights({x: 4, y: 2}, asteroids)).toHaveLength(5);
        expect(generateAllSights({x: 3, y: 4}, asteroids)).toHaveLength(8);
    });

    it('should find the best location (test data)', () => {
        const data0 = parse('day10/smallMap.txt');
        expect(findBestMonitoringLocation(data0)).toEqual([{x: 3, y: 4}, 8]);

        const data1 = parse('day10/test1.txt');
        expect(findBestMonitoringLocation(data1)).toEqual([{x: 5, y: 8}, 33]);

        const data2 = parse('day10/test2.txt');
        expect(findBestMonitoringLocation(data2)).toEqual([{x: 1, y: 2}, 35]);

        const data3 = parse('day10/test3.txt');
        expect(findBestMonitoringLocation(data3)).toEqual([{x: 6, y: 3}, 41]);

        const data4 = parse('day10/test4.txt');
        expect(findBestMonitoringLocation(data4)).toEqual([{x: 11, y: 13}, 210]);
    });

    it('should find the best location', () => {
        const data = parse('day10/map.txt');
        expect(findBestMonitoringLocation(data)).toEqual([{x: 22, y: 19}, 282]);
    });
});