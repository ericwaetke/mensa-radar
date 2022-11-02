import { supabase } from "../../lib/getSupabaseClient";


export default async function handler(req, res) {
	try {
		const request = JSON.parse(req.body);
		
		const { 
			offer,
			mensa,

			rating,
			sessionId
		} : {
			offer: string,
			mensa: string,

			rating: 0|1|2|3,
			sessionId: string
		} = request

		const { data: result, error } = await supabase
			.from('tag_reviews')
			.upsert({
				rating,
				userSessionId: sessionId,
			})
			.eq('userSessionId', sessionId)
			.eq('offerId', offer)
		
		// const result = await coll.updateOne(filter, update)
		result ? res.status(200).json({result}) : res.status(500).json({error});

		res.status(200).json({ text: result});

	} catch (error) {
		console.error(error)
		res.status(500).json({ text: JSON.stringify(error)});
	}
}