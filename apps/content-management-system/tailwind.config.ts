import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        colors: {
            background: 'rgb(var(--background-color-rgb) / <alpha-value>)',
            error: 'rgb(var(--error-color-rgb) / <alpha-value>)',
            info: 'rgb(var(--info-color-rgb) / <alpha-value>)',
            primary: 'rgb(var(--primary-color-rgb) / <alpha-value>)',
            secondary: 'rgb(var(--secondary-color-rgb) / <alpha-value>)',
            success: 'rgb(var(--success-color-rgb) / <alpha-value>)',
            text: 'rgb(var(--text-color-rgb) / <alpha-value>)',
            warning: 'rgb(var(--warning-color-rgb) / <alpha-value>)',
            black: 'rgb(var(--black-color-rgb) / <alpha-value>)',
            white: 'rgb(var(--white-color-rgb) / <alpha-value>)',
        },
    },
    plugins: [],
};

export default config;
