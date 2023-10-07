import { type Config } from 'tailwindcss';

export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    daisyui: {
        themes: ['light', 'dark', 'forest', 'aqua', 'winter'],
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography'), require('daisyui')],
} satisfies Config;
