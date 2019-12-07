import {range} from "./input";

describe('Input utils', () => {
    it('should generate range', () => {
        expect(range(2, 5)).toEqual([2, 3, 4, 5]);
    });

});