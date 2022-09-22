import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { mensa, offerId } = JSON.parse(req.body);
	try {
		const client = await clientPromise;
		const db = client.db("guckstDuEssen");

		const coll = db.collection(mensa);

        const offerQuery = {_id: new ObjectId(offerId)}
        let offer = await coll.findOne(offerQuery)

		res.status(200).json({
			qualityRatings: offer.qualityRating,
			amountRatings: offer.amountRating
		});
	} catch (e) {
		console.error(e)

		res.status(500).json({
			e
		});
	}
}