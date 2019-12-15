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
export interface RelativeAsteroid {
    vx: number;
    vy: number;
    distance?: number;
    angle?: number;
}

export function isHidden(current: RelativeAsteroid, existing: Array<RelativeAsteroid>) {
    const isMultiple = (current: RelativeAsteroid, other: RelativeAsteroid) => {
        const colinear = (current.vx * other.vy - other.vx * current.vy) == 0;
        const sameDirection = (current.vx * other.vx + current.vy * other.vy) > 0;
        return colinear && sameDirection;
    };
    return existing.some(each => isMultiple(current, each));
}

const round2 = (num) => Math.round(num * 100) / 100;
/**
 * Relative angle of the sight from the top, clockwise.
 */
const angleTop = (vx, vy) => round2((Math.atan2(vx, -vy) * 180 / Math.PI + 360) % 360);

export function toRelativeAsteroid(asteroid: Asteroid, center: Asteroid): RelativeAsteroid {
    const vx = asteroid.x - center.x;
    const vy = asteroid.y - center.y;
    const distance = round2(Math.sqrt(Math.pow(Math.abs(vx), 2) + Math.pow(Math.abs(vy), 2)));
    const angle = angleTop(vx, vy);
    return {vx, vy, distance, angle};
}

export function toAsteroid(relative: RelativeAsteroid, center: Asteroid): Asteroid {
    return {
        x: center.x + relative.vx,
        y: center.y + relative.vy,
    }
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

export function getRelativeAsteroids(asteroids: Array<Asteroid>, current: Asteroid) {
    return asteroids.filter(a => !(a.x == current.x && a.y == current.y))
        .map(a => toRelativeAsteroid(a, current));
}

function removeHidden(relatives: Array<RelativeAsteroid>) {
    const sorted = relatives.sort((a, b) => a.distance - b.distance);
    const recRemoveHidden = (acc: Array<RelativeAsteroid>, remainings: Array<RelativeAsteroid>): Array<RelativeAsteroid> =>
        remainings.length == 0
            ? acc
            : isHidden(remainings[0], acc)
            ? recRemoveHidden(acc, remainings.slice(1))
            : recRemoveHidden(acc.concat(remainings[0]), remainings.slice(1));
    return recRemoveHidden([], sorted);
}

export function findAllInSight(current: Asteroid, asteroids: Array<Asteroid>): Array<RelativeAsteroid> {
    const all = getRelativeAsteroids(asteroids, current)
        .sort((a, b) => a.distance - b.distance);

    return removeHidden(all);
}

export function findBestMonitoringLocation(asteroids: Array<Asteroid>): [Asteroid, number] {
    return asteroids.map(a => [a, findAllInSight(a, asteroids).length] as [Asteroid, number])
        .reduce((a, b) => a[1] >= b[1] ? a : b);
}

export function vaporizeOneRotation(relatives: Array<RelativeAsteroid>): Array<RelativeAsteroid> {
    const cleaned = removeHidden(relatives);
    return cleaned.sort((a, b) => a.angle - b.angle || a.distance - b.distance);
}

export function vaporize(asteroids: Array<Asteroid>, station: Asteroid): Array<Asteroid> {
    const key = (s: RelativeAsteroid) => `${s.vx}/${s.vy}`;

    const recVaporize = (destroyed: Array<RelativeAsteroid>, remaining: Array<RelativeAsteroid>): Array<RelativeAsteroid> => {
        if (remaining.length == 0) {
            return destroyed;
        } else {
            const destroyedThisTurn = vaporizeOneRotation(remaining);
            const keys = destroyedThisTurn.map(key);
            const newRemaining = remaining.filter(a => !keys.includes(key(a)));
            return recVaporize([...destroyed, ...destroyedThisTurn], newRemaining);
        }
    };
    return recVaporize([], getRelativeAsteroids(asteroids, station))
        .map(s => toAsteroid(s, station));
}