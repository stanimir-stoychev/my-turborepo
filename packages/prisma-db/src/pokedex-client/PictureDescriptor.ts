import fs from 'fs';
import https from 'https';
import chroma from 'chroma-js';
import colorPalette from 'get-image-colors';

import { TPicturePalette } from '../types';

const downloadImage = ({
    directory = 'temp/static/img',
    fileName,
    src,
}: {
    src: string;
    directory?: string;
    fileName?: string | ((currentName: string) => string);
}) =>
    new Promise<string>((resolve, reject) => {
        const nameParts = src.split('/').pop()?.split('.') ?? [];
        const fExt = nameParts.pop();
        const currentName = nameParts.join('.');
        const fName = typeof fileName === 'string' ? fileName : fileName?.(currentName) ?? currentName;

        const filepath = `${directory}/${fName}.${fExt}`;

        if (fs.existsSync(filepath)) {
            resolve(filepath);
            return;
        }

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        https
            .get(src, (response) => {
                const file = fs.createWriteStream(filepath);

                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(filepath);
                });
            })
            .on('error', (err) => {
                reject(err);
            });
    });

const getImagePalette = async ({
    colorsPerPalette = 5,
    ...downloadArgs
}: { colorsPerPalette?: number } & Parameters<typeof downloadImage>[0]): Promise<TPicturePalette> => {
    const src = await downloadImage(downloadArgs);
    const ext = src.split('.').pop();
    const type = `image/${ext}`;

    const chromaPalette = await colorPalette(fs.readFileSync(src), {
        type,
        count: colorsPerPalette,
    });

    const palette = chromaPalette.map((color) => color.hex());
    const [primary, secondary, tertiary] = [chromaPalette[0], chromaPalette[1], chromaPalette[2]].map(
        (color, heaviestIndex) => {
            if (!color) return;

            const bgColor = color.luminance() > 0.5 ? color.darken() : color.brighten();
            const average = chroma.average(
                chromaPalette,
                'lch',
                Array.from({ length: colorsPerPalette }, (_, index) =>
                    index === heaviestIndex ? colorsPerPalette + 1 : index,
                ),
            );

            const averageBg = average.luminance() > 0.5 ? average.darken() : average.brighten();

            return {
                average: {
                    base: average.hex(),
                    bg: averageBg.hex(),
                    text: averageBg.luminance(0.01).hex(),
                },
                base: {
                    base: color.hex(),
                    text: bgColor.luminance(0.01).hex(),
                    bg: bgColor.hex(),
                },
            };
        },
    );

    return {
        palette,
        primary,
        secondary,
        tertiary,
    };
};

export class PictureDescriptor {
    static downloadImage = downloadImage;
    static getImagePalette = getImagePalette;
}
