/** @type {import('next').NextConfig} */
module.exports = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: ['raw.githubusercontent.com'],
    },
    reactStrictMode: true,
    transpilePackages: ['ui'],
};
