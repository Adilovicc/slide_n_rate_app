/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["firebasestorage.googleapis.com"],
    },
 
    webpack: (
          config,
          { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
    ) => {
          // Important: return the modified config
          return config
    },
      
}

module.exports = nextConfig
