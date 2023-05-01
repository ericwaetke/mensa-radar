import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/getSupabaseClient';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const { offerId } = JSON.parse(req.body);
		const { data: qualityRatings, error: qualityRatingError } = await supabase
			.from('quality_reviews')
			.select('rating, userSessionId')
			.eq('offerId', offerId)

		const { data: tagReviews, error: tagReviewError } = await supabase
			.from('tag_reviews')
			.select('tags')
			.eq('offerId', offerId)


		res.status(200).json({
			qualityRatings,
			tagReviews
		});
	} catch (e) {
		console.error(e)

		res.status(500).json({
			e
		});
	}
}