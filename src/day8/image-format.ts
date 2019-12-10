import {readFileAsLines} from "../utils/input";

export function sliceLayers(image: string, width: number, height: number): Array<string> {
    const slicer = new RegExp('.{' + width * height + '}', 'g');
    return image.match(slicer);
}

export function sliceInputFile(file: string, width: number, height: number): Array<string> {
    const [input] = readFileAsLines(file);
    return sliceLayers(input, width, height);
}

export function countDigit(digit: string, str: string): number {
    return str.split('')
        .filter(c => c == digit)
        .length;
}

export function findLayerWithFewestO(file: string, width: number, height: number): string {
    return sliceInputFile(file, width, height)
        .reduce((a, b) => {
            const countA = countDigit('0', a);
            const countB = countDigit('0', b);
            return countA <= countB ? a : b;
        });
}

export interface Pixel {
    x: number;
    y: number;
    value: number;
}

export function computePixels(layers: Array<string>, width: number) {
    return layers
        .map(layer => layer.split('')
            .map((p, index) => ({
                x: index % width,
                y: Math.floor(index / width),
                value: +p,
            }))).reduce((layer1, layer2) =>
            layer1.map((pixel, index) => ({
                ...pixel,
                value: pixel.value != 2
                    ? pixel.value
                    : layer2[index].value,
            }))
        )
}

export function displayImage(pixels: Array<Pixel>, width: number) {
    const joinedPixels = pixels.map(pixel => pixel.value == 0 ? '■' : ' ')
        .join('');
    const image = sliceLayers(joinedPixels, width, 1)
        .join('\n');
    console.log(image);
}