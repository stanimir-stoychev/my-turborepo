export class StringUtils {
    static capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static removeDelimiters(str: string, delimiters: string[] = ['-', '_']) {
        return str.replace(new RegExp(`[${delimiters.join('')}]`, 'g'), '');
    }

    static replaceDelimiters(str: string, replacement: string, delimiters: string[] = ['-', '_']) {
        return str.replace(new RegExp(`[${delimiters.join('')}]`, 'g'), replacement);
    }

    static padNumber(number: number, width: number, prefix = '0') {
        const numberStr = `${number}`;

        if (numberStr.length >= width) {
            return numberStr;
        }

        return `${prefix.repeat(width - numberStr.length)}${numberStr}`;
    }
}
