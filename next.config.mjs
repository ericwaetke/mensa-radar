import "./src/env.mjs";
/** @type {import('next').NextConfig} */
// Import next-pwa
import nextPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";

const withPWA = nextPWA({
	dest: "public",
	register: true,
	skipWaiting: true,
	runtimeCaching,
	disable: process.env.NODE_ENV === "development",
});

/**
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
	return config;
}

const nextConfig = defineNextConfig({
	// Enable only for docker
	// output: 'standalone',
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
			},
			// Supabase Storage
			{
				protocol: 'https',
				hostname: 'bqfzesnwsvziyglfeezk.supabase.co',
				pathname: '/storage/**',
			},
			{
				protocol: 'https',
				hostname: 'uploadthing.com',
			},
			// uploadcare
			{
				protocol: 'https',
				hostname: 'ucarecdn.com',
			},
			{
				protocol: 'https',
				hostname: 'ai.ericwaetke.de',
			}
		],
	},
	experimental: {
		esmExternals: false, // THIS IS THE FLAG THAT MATTERS
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value: '*',
					},
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
					},
					{
						key: 'Access-Control-Allow-Headers',
						value: 'X-Requested-With, Content-Type, Authorization',
					},
				],
			},
		];
	},

});

export default withPWA(nextConfig);
