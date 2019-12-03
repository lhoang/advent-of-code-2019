// import {intersection} from 'ramda';
import intersect from 'fast_array_intersect'

export interface Point {
  x: number;
  y: number;
}

export function serializePoint(point: Point): string {
  return point.x + '/' + point.y;
}

export function deserializePoint(value: string): Point {
  const [x, y] = value.split('/')
    .map(v => +v);
  return {x, y};
}

/**
 * Move point.
 * @param direction
 */
function getMove(direction): ((Point) => Point) {
  let move;
  switch (direction) {
    case 'U':
      move = (point: Point) => ({
        x: point.x,
        y: point.y + 1,
      });
      break;
    case 'D':
      move = (point: Point) => ({
        x: point.x,
        y: point.y - 1,
      });
      break;
    case 'L':
      move = (point: Point) => ({
        x: point.x - 1,
        y: point.y,
      });
      break;
    case 'R':
      move = (point: Point) => ({
        x: point.x + 1,
        y: point.y,
      });
      break;
    default:
    // nothing;
  }
  return move;
}

/**
 * Generate all points for a command.
 */
export function generatePoints(position: Point, direction: string, steps: number): Array<Point> {
  const move = getMove(direction);

  let currentPosition = position;
  const res: Array<Point> = [];
  for (let i = 0; i < steps; i++) {
    const newPoint = move(currentPosition);
    res.push(newPoint);
    currentPosition = newPoint;
  }
  return res;
}

/**
 * All points in grid for the given path.
 * starting à [0, 0]
 * @param path
 */
export function getPathPoints(path: string): Array<Point> {
  const parseCommand = (command: string): [string, number] => [command[0], +command.slice(1)];
  const commands = path.split(',');

  return commands.reduce((acc: Array<Point>, current: string) => {
    const currentPosition: Point = acc[acc.length - 1];
    const newPoints = generatePoints(currentPosition, ...parseCommand(current));
    acc.push(...newPoints);
    return acc;
  }, [{x: 0, y: 0}]);
}

export function findCrossingWires(wire1: string, wire2: string): Array<Point> {
  const points1 = getPathPoints(wire1).map(serializePoint);
  const points2 = getPathPoints(wire2).map(serializePoint);
  // Note : Ramda/intersection is very slow !!! (57s) vs 215ms with fast_array_intersect
  const crossing = intersect([points1, points2]);
  // remove origin
  return crossing.filter(p => p !== '0/0')
    .map(deserializePoint);
}

export function getManhattanDistanceOfClosestIntersection(wire1: string, wire2: string): number {
  const intersections = findCrossingWires(wire1, wire2);
  const numbers = intersections
    //.filter(p => p.x >= 0 && p.y >= 0)
    .map(p => Math.abs(p.x) + Math.abs(p.y));
  return numbers
    .reduce((a, b) => Math.min(a, b));
}