import {
    deserializePoint,
    findCrossingWires,
    findMinStepsForIntersection,
    generatePoints,
    getManhattanDistanceOfClosestIntersection,
    getPathPoints,
    serializePoint,
} from './crossed-wires';
import {readFileAsLines} from '../utils/input';

describe('Crossed Wire', () => {
  it('should serialize and deserialize', () => {
    expect(serializePoint({x: 654, y: 876})).toEqual('654/876');
    expect(deserializePoint('654/876')).toEqual({x: 654, y: 876});
    expect(deserializePoint('654/879876')).toEqual({x: 654, y: 879876});
  });

  it('should generate all points for one command', () => {
    expect(generatePoints({x: 0, y: 0}, 'U', 3)).toEqual([
      {x: 0, y: 1},
      {x: 0, y: 2},
      {x: 0, y: 3},
    ]);

    expect(generatePoints({x: 3, y: 4}, 'D', 3)).toEqual([
      {x: 3, y: 3},
      {x: 3, y: 2},
      {x: 3, y: 1},
    ]);

    expect(generatePoints({x: 3, y: 4}, 'L', 2)).toEqual([
      {x: 2, y: 4},
      {x: 1, y: 4},
    ]);

    expect(generatePoints({x: 3, y: 4}, 'R', 2)).toEqual([
      {x: 4, y: 4},
      {x: 5, y: 4},
    ]);
  });

  it('should generate path points', () => {
    expect(getPathPoints('R8,U5')).toEqual([
      {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0},
      {x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0},
      {x: 8, y: 1}, {x: 8, y: 2}, {x: 8, y: 3}, {x: 8, y: 4}, {x: 8, y: 5},
    ]);
  });

  it('should find intersections', () => {
    const wire1 = 'R8,U5,L5,D3';
    const wire2 = 'U7,R6,D4,L4';
    expect(findCrossingWires(wire1, wire2)).toEqual(expect.arrayContaining([
      {x: 3, y: 3},
      {x: 6, y: 5},
    ]));
    expect(findCrossingWires(wire1, wire2)).not.toEqual(expect.arrayContaining([
      {x: 0, y: 0},
    ]));
  });

  it('should find the Manhattan Distance of the closest intersection', () => {
    const wire1 = 'R8,U5,L5,D3';
    const wire2 = 'U7,R6,D4,L4';
    expect(getManhattanDistanceOfClosestIntersection(wire1, wire2)).toEqual(6);

    const wire1b = 'R75,D30,R83,U83,L12,D49,R71,U7,L72';
    const wire2b = 'U62,R66,U55,R34,D71,R55,D58,R83';
    expect(getManhattanDistanceOfClosestIntersection(wire1b, wire2b)).toEqual(159);

    const wire1c = 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51';
    const wire2c = 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7';
    expect(getManhattanDistanceOfClosestIntersection(wire1c, wire2c)).toEqual(135);
  });

  it('should find the distance for the ship ', () => {
    const [wire1, wire2] = readFileAsLines('day3/paths.txt');
    expect(getManhattanDistanceOfClosestIntersection(wire1, wire2)).toEqual(855);
  });


    it('should compute minimum steps to reach intersection', () => {
        const wire1 = 'R8,U5,L5,D3';
        const wire2 = 'U7,R6,D4,L4';
        expect(findMinStepsForIntersection(wire1, wire2)).toEqual(30);

        const wire1b = 'R75,D30,R83,U83,L12,D49,R71,U7,L72';
        const wire2b = 'U62,R66,U55,R34,D71,R55,D58,R83';
        expect(findMinStepsForIntersection(wire1b, wire2b)).toEqual(610);

        const wire1c = 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51';
        const wire2c = 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7';
        expect(findMinStepsForIntersection(wire1c, wire2c)).toEqual(410);
    });

    it('should find minimum steps to reach intersection for the ship ', () => {
        const [wire1, wire2] = readFileAsLines('day3/paths.txt');
        expect(findMinStepsForIntersection(wire1, wire2)).toEqual(11238);
    });
});