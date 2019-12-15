import {
    findAllInSight,
    findBestMonitoringLocation,
    getRelativeAsteroids,
    isHidden,
    parse,
    RelativeAsteroid,
    toAsteroid,
    toRelativeAsteroid,
    vaporize,
    vaporizeOneRotation
} from "./monitoring-station";

describe('Monitoring Station', () => {

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

    it('should transform an asteroid to a relative asteroid', () => {
        expect(toRelativeAsteroid({x: 2, y: 3}, {x: 1, y: 1}))
            .toMatchObject({vx: 1, vy: 2, distance: 2.24});
        expect(toRelativeAsteroid({x: 2, y: 3}, {x: 0, y: 0}))
            .toMatchObject({vx: 2, vy: 3, distance: 3.61});
        expect(toRelativeAsteroid({x: 2, y: 3}, {x: 4, y: 4}))
            .toMatchObject({vx: -2, vy: -1, distance: 2.24});
        expect(toRelativeAsteroid({x: 1, y: 4}, {x: 4, y: 4}))
            .toMatchObject({vx: -3, vy: 0, distance: 3});
    });

    it('should have the right angle', () => {
        expect(toRelativeAsteroid({x: 2, y: 0}, {x: 2, y: 2})).toMatchObject({angle: 0});
        expect(toRelativeAsteroid({x: 4, y: 2}, {x: 2, y: 2})).toMatchObject({angle: 90});
        expect(toRelativeAsteroid({x: 2, y: 4}, {x: 2, y: 2})).toMatchObject({angle: 180});
        expect(toRelativeAsteroid({x: 0, y: 2}, {x: 2, y: 2})).toMatchObject({angle: 270});
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
        expect(findAllInSight({x: 4, y: 2}, asteroids)).toHaveLength(5);
        expect(findAllInSight({x: 3, y: 4}, asteroids)).toHaveLength(8);
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

    it('should vaporize asteroids in one rotation', () => {
        const toA = (sight: RelativeAsteroid) => toAsteroid(sight, {x: 8, y: 3});

        const asteroids = parse('day10/testVaporisation.txt');
        const allSights = getRelativeAsteroids(asteroids, {x: 8, y: 3});
        const sights = vaporizeOneRotation(allSights);
        const firstRotationDestroyed = sights
            .map(toA);
        expect(firstRotationDestroyed).toHaveLength(30);
        expect(firstRotationDestroyed[0]).toMatchObject({x: 8, y: 1});
        expect(firstRotationDestroyed[29]).toMatchObject({x: 7, y: 0});
    });

    it('should vaporize (test data)', () => {
        const asteroids = parse('day10/testVaporisation.txt');
        const res = vaporize(asteroids, {x: 8, y: 3});
        expect(res).toHaveLength(36);
        expect(res[0]).toEqual({x: 8, y: 1});
        expect(res[35]).toEqual({x: 14, y: 3});
    });

    it('should vaporize !', () => {
        const asteroids = parse('day10/map.txt');
        const res = vaporize(asteroids, {x: 22, y: 19});
        expect(res).toHaveLength(365);
        expect(res[0]).toEqual({x: 22, y: 16});
        expect(res[199]).toEqual({x: 10, y: 8});
    });
});