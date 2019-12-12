import {readFileAsLines} from "../utils/input";

/**
 * Asteroids in absolute position.
 */
export interface Asteroid {
    x: number;
    y: number;
}

/**
 * Asteroids in relative position.
 */
export interface Sight {
    vx: number;
    vy: number;
    distance?: number;
}

export function isOnMap(asteroid: Asteroid, width: number, height: number): boolean {
    return asteroid.x >= 0
        && asteroid.x <= width
        && asteroid.y >= 0
        && asteroid.y <= height;
}

export function isHidden(current: Sight, existing: Array<Sight>) {
    const isMultiple = (current: Sight, other: Sight) => {
        const colinear = (current.vx * other.vy - other.vx * current.vy) == 0;
        const sameDirection = (current.vx * other.vx + current.vy * other.vy) > 0;
        return colinear && sameDirection;
    };
    return existing.some(each => isMultiple(current, each));
}

export function toSight(asteroid: Asteroid, center: Asteroid): Sight {
    const round2 = (num) => Math.round(num * 100) / 100;
    const vx = asteroid.x - center.x;
    const vy = asteroid.y - center.y;
    const distance = round2(Math.sqrt(Math.pow(Math.abs(vx), 2) + Math.pow(Math.abs(vy), 2)));
    return {vx, vy, distance};
}


export function parse(file: string): Array<Asteroid> {
    const res = readFileAsLines(file)
        .map((line, lng) =>
            line.split('')
                .map((char, lat) =>
                    char == '#'
                        ? {x: lat, y: lng}
                        : undefined
                )
                .filter(v => !!v));
    return [].concat(...res);
}

export function generateAllSights(current: Asteroid, asteroids: Array<Asteroid>) {
    const all = asteroids.filter(a => !(a.x == current.x && a.y == current.y))
        .map(a => toSight(a, current))
        .sort((a, b) => a.distance - b.distance);

    const removeHidden = (acc: Array<Sight>, remainings: Array<Sight>) =>
        remainings.length == 0
            ? acc
            : isHidden(remainings[0], acc)
            ? removeHidden(acc, remainings.slice(1))
            : removeHidden(acc.concat(remainings[0]), remainings.slice(1));

    return removeHidden([], all);
}

export function findBestMonitoringLocation(asteroids: Array<Asteroid>): [Asteroid, number] {
    return asteroids.map(a => [a, generateAllSights(a, asteroids).length] as [Asteroid, number])
        .reduce((a, b) => a[1] >= b[1] ? a : b);
}