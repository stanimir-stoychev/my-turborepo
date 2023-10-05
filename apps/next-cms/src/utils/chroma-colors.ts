import chroma, { type Color } from 'chroma-js';

type TColor = string | number | Color;

function shades(
    color: TColor,
    {
        noAbsoluteWhite = true,
        noAbsoluteBlack = true,
        numberOfShades = 13,
    }: {
        noAbsoluteWhite?: boolean;
        noAbsoluteBlack?: boolean;
        numberOfShades?: number;
    } = {},
) {
    const chromaColor = chroma(color);
    const shades = chroma
        .scale(['#ffffff', chromaColor, '#000000'])
        .mode('rgb')
        .colors(numberOfShades)
        .filter((color) => {
            if (noAbsoluteWhite && color === '#ffffff') return false;
            if (noAbsoluteBlack && color === '#000000') return false;
            return true;
        })
        .map((color) => {
            const text: 'black' | 'white' =
                chroma.contrast(color, '#ffffff') > chroma.contrast(color, '#000000') ? 'white' : 'black';

            return { color, text };
        });

    return { chromaColor, shades };
}

/**
 * Two colors that are on opposite sides of the color wheel.
 * This combination provides a high contrast and high impact color combination –
 * together, these colors will appear brighter and more prominent.
 *
 * @param color The base color
 * @returns The calculated complimentary color
 */
function complimentary(color: TColor) {
    const chromaColor = chroma(color);
    const [hue, saturation, lightness] = chromaColor.hsl();

    if (isNaN(hue))
        return {
            chromaColor,
            complimentary: chromaColor.hex(),
            complimentaryColor: chromaColor,
        };

    const complimentaryHue = hue > 180 ? hue - 180 : hue + 180;
    const complimentaryColor = chroma.hsl(complimentaryHue, saturation, lightness);

    return {
        chromaColor,
        complimentary: complimentaryColor.hex(),
        complimentaryColor,
    };
}

/**
 * Three colors that are side by side on the color wheel.
 * This color combination is versatile, but can be overwhelming.
 * To balance an analogous color scheme, choose one dominant color, and use the others as accents.
 *
 * @param color The base color
 * @returns The generated analogous colors
 */
function analogous(color: TColor) {
    const chromaColor = chroma(color);
    const [hue, saturation, lightness] = chromaColor.hsl();

    if (isNaN(hue))
        return {
            chromaColor,
            analogous: [chromaColor.hex(), chromaColor.hex()] as const,
            analogousColors: [chromaColor, chromaColor] as const,
        };

    const analogousColors = [
        chroma.hsl(hue - 30, saturation, lightness),
        chroma.hsl(hue + 30, saturation, lightness),
    ] as const;

    return {
        chromaColor,
        analogous: [analogousColors[0].hex(), analogousColors[1].hex()] as const,
        analogousColors,
    };
}

/**
 * Three colors that are evenly spaced on the color wheel.
 * This provides a high contrast color scheme, but less so than the complementary color combination —
 * making it more versatile. This combination creates bold, vibrant color palettes.
 *
 * @param color The base color
 * @returns The generated triadic colors
 */
function triadic(color: TColor) {
    const chromaColor = chroma(color);
    const [hue, saturation, lightness] = chromaColor.hsl();

    if (isNaN(hue))
        return {
            chromaColor,
            triadic: [chromaColor.hex(), chromaColor.hex()] as const,
            triadicColors: [chromaColor, chromaColor] as const,
        };

    const triadicColors = [
        chroma.hsl(hue - 120, saturation, lightness),
        chroma.hsl(hue + 120, saturation, lightness),
    ] as const;

    return {
        chromaColor,
        triadic: [triadicColors[0].hex(), triadicColors[1].hex()] as const,
        triadicColors,
    };
}

/**
 * Four colors that are evenly spaced on the color wheel.
 * Tetradic color schemes are bold and work best if you let one color be dominant, and use the others as accents.
 * The more colors you have in your palette, the more difficult it is to balance.
 *
 * @param color The base color
 * @returns The generated tetradic colors
 */
function tetradic(color: TColor) {
    const chromaColor = chroma(color);
    const [hue, saturation, lightness] = chromaColor.hsl();

    if (isNaN(hue))
        return {
            chromaColor,
            tetradic: [chromaColor.hex(), chromaColor.hex(), chromaColor.hex()] as const,
            tetradicColors: [chromaColor, chromaColor, chromaColor] as const,
        };

    const tetradicColors = [
        chroma.hsl(hue - 90, saturation, lightness),
        chroma.hsl(hue + 90, saturation, lightness),
        chroma.hsl(hue + 180, saturation, lightness),
    ] as const;

    return {
        chromaColor,
        tetradic: [tetradicColors[0].hex(), tetradicColors[1].hex(), tetradicColors[2].hex()] as const,
        tetradicColors,
    };
}

export const ChromaColors = {
    analogous,
    complimentary,
    random: chroma.random,
    shades,
    tetradic,
    triadic,
} as const;
