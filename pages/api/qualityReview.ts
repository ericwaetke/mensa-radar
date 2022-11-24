import { supabase } from "../../lib/getSupabaseClient";


export default async function handler(req, res) {
	try {
		const request = JSON.parse(req.body);
		console.log(req.body);
		
		const { 
			offerId,

			rating,
			sessionId
		} : {
			offerId: string,

			rating: 0|1|2|3,
			sessionId: string
		} = request

		console.log(offerId, rating, sessionId);

		// Check if the user has already rated this food offering
		// if so, get ID
		const { data: reviewId, error: reviewIdError } = await supabase
			.from('quality_reviews')
			.select('id')
			.eq('offerId', offerId)
			.eq('userSessionId', sessionId)


		const { data: result, error } = await supabase
			.from('quality_reviews')
			.upsert({
				id: reviewId[0]?.id,
				rating,
				userSessionId: sessionId,
				offerId,
			})
			.eq('userSessionId', sessionId)
			.eq('offerId', offerId)
			.select()

		console.error(error)
		
		// const result = await coll.updateOne(filter, update)
		result ? res.status(200).json({result}) : res.status(500).json({error});

		// res.status(200).json({ text: result});

	} catch (error) {
		console.error(error)
		res.status(500).json({ text: JSON.stringify(error)});
	}
}