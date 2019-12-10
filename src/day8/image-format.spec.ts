import {
    computePixels,
    countDigit,
    displayImage,
    findLayerWithFewestO,
    sliceInputFile,
    sliceLayers
} from "./image-format";

describe('Image Format', () => {
    it('should slice layers', () => {
        expect(sliceLayers('123456789012', 3, 2)).toEqual([
                '123456',
                '789012',
            ]
        );
    });

    it('should slice input', () => {
        expect(sliceInputFile('day8/input.txt', 25, 6)).toHaveLength(100);
    });

    it('should  count occurences of digit in string', () => {
        expect(countDigit('0', '0011002200')).toEqual(6);
        expect(countDigit('1', '0011002200')).toEqual(2);
    });

    it('should find the layer with fewest 0', () => {
        const fewestO = findLayerWithFewestO('day8/input.txt', 25, 6);
        expect(countDigit('1', fewestO)).toEqual(12);
        expect(countDigit('2', fewestO)).toEqual(132);
    });

    it('should compute the pixels for the test data', () => {
        const layers = sliceLayers('0222112222120000', 2, 2);
        const pixels = computePixels(layers, 2);
        expect(pixels).toEqual([
            {x: 0, y: 0, value: 0},
            {x: 1, y: 0, value: 1},
            {x: 0, y: 1, value: 1},
            {x: 1, y: 1, value: 0},
        ]);
        //displayImage(pixels, 2);
    });
    it('should compute the pixels and display image', () => {
        const layers = sliceInputFile('day8/input.txt', 25, 6);
        const pixels = computePixels(layers, 25);
        displayImage(pixels, 25); // KCGEC
    });
});