const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
	dest: "public",
	register: true,
	skipWaiting: true,
	runtimeCaching,
	buildExcludes: [/middleware-manifest.json$/],
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

const nextConfig = withPWA({
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3000',
				pathname: '/api/image/**',
			},
		],
	},
	pwa: {
		dest: 'public',
		disable: process.env.NODE_ENV === 'production' ? false : true
	},
	api: {
		bodyParser: {
			sizeLimit: '20mb' // Set desired value here
		}
	}
});
module.exports = nextConfig;