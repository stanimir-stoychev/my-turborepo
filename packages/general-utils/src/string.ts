export const StringUtils = {
    capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    removeDelimiters(str: string, delimiters: string[] = ['-', '_']) {
        return str.replace(new RegExp(`[${delimiters.join('')}]`, 'g'), '');
    },

    replaceDelimiters(str: string, replacement: string, delimiters: string[] = ['-', '_']) {
        return str.replace(new RegExp(`[${delimiters.join('')}]`, 'g'), replacement);
    },

    padNumber(number: number, width: number, prefix = '0') {
        const numberStr = `${number}`;

        if (numberStr.length >= width) {
            return numberStr;
        }

        return `${prefix.repeat(width - numberStr.length)}${numberStr}`;
    },
} as const;
