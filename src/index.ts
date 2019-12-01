import {readFileAsLines} from "./utils/input";
import {computeRequiredFuel} from "./day1/fuel-requirements";

console.log('Advent of Code');

console.log('Day 1')
const moduleMasses = readFileAsLines('day1/input.txt')
    .map(v => +v);

const computedMass = computeRequiredFuel(moduleMasses);
console.log('Fuel requirements for the spacecraft: ', computedMass);