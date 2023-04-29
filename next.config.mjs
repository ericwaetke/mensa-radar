import "./src/env.mjs";
/** @type {import('next').NextConfig} */
// Import next-pwa 
import * as nextPWA from 'next-pwa';

const withPWA = nextPWA({
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
			{
				protocol: 'https',
				hostname: '**.mensa-radar.de',
			}
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