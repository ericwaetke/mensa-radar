const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    runtimeCaching,
    buildExcludes: [/middleware-manifest.json$/],
});

const nextConfig = withPWA({
    pwa: {
        dest: 'public',
        disable: process.env.NODE_ENV === 'production' ? false : true
    }
});
module.exports = nextConfig;