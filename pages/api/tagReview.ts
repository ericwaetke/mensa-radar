import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const request = JSON.parse(req.body);
		const {
			mensa,
			offerId,
			tagReviews = {},

			sessionId,
			tags
		}:{
			mensa: string,
			offerId: string,
			tagReviews: { "?"?: string[] },

			sessionId: string,
			tags: string[]
		} = request

		const client = await clientPromise
		const db = client.db("guckstDuEssen")
		const coll = db.collection(mensa);

		const filter = {_id: new ObjectId(offerId)}

		let tempReviews = {};
		tags.map(tag => {
			if (tagReviews[tag]) {
				tempReviews[tag] = [...tagReviews[tag].filter(alreadySavedSessionIds => alreadySavedSessionIds !== sessionId), sessionId]
			} else {
				tempReviews[tag] = [sessionId]
			}
		})

		const update = {
			$set: {
				"reviewTags": tempReviews
			}
		}
		

		const result = await coll.updateOne(filter, update)
		res.status(200).json({result});

	} catch (error) {
		console.error(error)
		res.status(500).json({ text: JSON.stringify(error)});
	}
}