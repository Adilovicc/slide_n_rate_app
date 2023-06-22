/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["firebasestorage.googleapis.com"],
    },
    experimental: {
        legacyBrowsers: false,
        outputFileTracingIgnores: ['**canvas**'],
    },
}

module.exports = nextConfig
