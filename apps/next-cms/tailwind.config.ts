import { type Config } from 'tailwindcss';

export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
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
} satisfies Config;
