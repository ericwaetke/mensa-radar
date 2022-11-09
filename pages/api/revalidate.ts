import { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../lib/getSupabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
		// Check for secret to confirm this is a valid request

		if (req.headers.authorization !== `Bearer ${process.env.REVALIDATION_TOKEN}`) {
			return res.status(401).json({ message: 'Invalid token' })
		}
	
		try {

			const {data: mensaData} = await supabase
				.from("mensen")
				.select('url')

			const days = ["montag", "dienstag", "mittwoch", "donnerstag", "freitag", "samstag"]

			Promise.all(
				mensaData.map(mensa => {
					days.map(day => {
						console.log(`Revalidating ${mensa.url}/${day}`)
						res.revalidate(`/mensa/${mensa.url}/${day}`)
					})
				})
			)
			return res.json({ revalidated: true })
		} catch (err) {
			// If there was an error, Next.js will continue
			// to show the last successfully generated page
			return res.status(500).send('Error revalidating')
		}
	}