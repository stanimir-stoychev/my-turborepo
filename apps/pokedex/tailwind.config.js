/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            flex: {
                '1/2': '1 1 50%',
                '1/3': '1 1 33.333333%',
                '2/3': '2 2 66.666667%',
            },
            minWidth: {
                120: '34rem',
                96: '24rem',
                80: '20rem',
                72: '18rem',
                64: '16rem',
                56: '14rem',
                48: '12rem',
                40: '10rem',
                32: '8rem',
                24: '6rem',
            },
        },
    },
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
