// pages/server-sitemap.xml/index.tsx
import { getServerSideSitemapLegacy } from 'next-sitemap'
import { GetServerSideProps } from 'next'
import { supabase } from '../../lib/getSupabaseClient'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')

	// Get all mensen from the database
	const { data: mensen, error: mensenError } = await supabase
		.from('mensen')
		.select(`url`)

		console.log(mensen)

	const fields = mensen ? mensen.map(mensa => {
		return {
			loc: `https://mensa-radar.de/mensa/${mensa.url}`, // Absolute url
			lastmod: new Date().toISOString(),
			// changefreq
			// priority
		}
	}) : []

	return getServerSideSitemapLegacy(ctx, fields)
}

// Default export to prevent next.js errors
export default function Sitemap() {}