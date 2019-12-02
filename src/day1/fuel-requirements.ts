/**
 * https://adventofcode.com/2019/day/1
 */

export function fuel(mass: number) {
    return Math.floor(mass / 3) - 2;
}

export function computeRequiredFuel(masses: Array<number>): number {
    return masses
      .map(fuel)
      .reduce((a, b) => a + b);
}

export function computeRequiredFuelWithFuelIncluded(mass: number): number {
    const fuelRec = (acc: number, fuelMass: number): number => {
        const newFuel = fuel(fuelMass);
        return newFuel <= 0
          ? acc
          : (fuelRec(acc + newFuel, newFuel));
    };

    return fuelRec(0, mass);
}

export function computeTotalRequiredFuelWithFuelIncluded(masses: Array<number>): number {
    return masses
      .map(computeRequiredFuelWithFuelIncluded)
      .reduce((a, b) => a + b);
}