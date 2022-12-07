import { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../lib/getSupabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
		// Check for secret to confirm this is a valid request

		if (req.headers.authorization !== `Bearer ${process.env.REVALIDATION_TOKEN}`) {
			return res.status(401).json({ message: 'Invalid token: ' + req.headers.authorization })
		}
	
		try {
			const {data: mensaData} = await supabase
				.from("mensen")
				.select('url')


			await Promise.all(
				mensaData.map(async mensa => {
					const dev = process.env.NODE_ENV === "development"
					return fetch(`${dev ? "http://localhost:3000/" : "https://mensa-radar.de"}/api/refreshMensaData`, {
						method: 'POST',
						body: JSON.stringify({
							mensa: mensa.url,
						}),
					}).then((res) => res.json())
				})
			)
			.then((data) => {
				return res.status(200).json({ revalidated: true, data: data })
			})
		} catch (err) {
			// If there was an error, Next.js will continue
			// to show the last successfully generated page
			return res.status(500).send({message: 'Error revalidating', data: err})
		}
	}