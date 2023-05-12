/** @type {import('next').NextConfig} */
module.exports = {
    experimental: {
        serverActions: true,
    },
    images: {
        domains: ['raw.githubusercontent.com'],
    },
    reactStrictMode: true,
    transpilePackages: ['ui'],
};
