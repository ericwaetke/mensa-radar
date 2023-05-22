/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.SITE_URL || 'https://mensa-radar.de',
	generateRobotsTxt: true, // (optional)
	exclude: ['/server-sitemap.xml'], // <= exclude here
	robotsTxtOptions: {
		additionalSitemaps: [
		'https://mensa-radar.de/server-sitemap.xml', // <==== Add here
		],
	},// ...other options
}