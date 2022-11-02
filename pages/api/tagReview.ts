import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/getSupabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const request = JSON.parse(req.body);
		const {
			mensa,
			offerId,

			sessionId,
			tags
		}:{
			mensa: string,
			offerId: string,

			sessionId: string,
			tags: string[]
		} = request

		const { data: result, error } = await supabase
			.from('tag_reviews')
			.upsert({
				tags,
				userSessionId: sessionId,
			})
			.eq('userSessionId', sessionId)
			.eq('offerId', offerId)
		
		// const result = await coll.updateOne(filter, update)
		result ? res.status(200).json({result}) : res.status(500).json({error});

	} catch (error) {
		console.error(error)
		res.status(500).json({ text: JSON.stringify(error)});
	}
}