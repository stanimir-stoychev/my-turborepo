import { type Config } from 'tailwindcss';

export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    daisyui: {
        themes: [
            'light',
            'dark',
            'cupcake',
            'bumblebee',
            'emerald',
            'corporate',
            'synthwave',
            'retro',
            'cyberpunk',
            'valentine',
            'halloween',
            'garden',
            'forest',
            'aqua',
            'lofi',
            'pastel',
            'fantasy',
            'wireframe',
            'black',
            'luxury',
            'dracula',
            'cmyk',
            'autumn',
            'business',
            'acid',
            'lemonade',
            'night',
            'coffee',
            'winter',
        ],
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography'), require('daisyui')],
    theme: {
        extend: {
            maxHeight({ theme }) {
                return { ...theme('height') };
            },
            maxWidth({ theme }) {
                return { ...theme('width') };
            },
            minHeight({ theme }) {
                return { ...theme('height') };
            },
            minWidth({ theme }) {
                return { ...theme('width') };
            },
        },
    },
} satisfies Config;
