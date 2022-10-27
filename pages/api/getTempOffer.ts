import { createClient } from '@supabase/supabase-js';
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const {mensaUrl, offerId} = JSON.parse(req.body)
	try {
		const client = await clientPromise;
		const db = client.db("guckstDuEssen");

		const coll = await db.collection(mensaUrl);

        const offerQuery = {_id: new ObjectId(offerId)}
		let offer = await coll.findOne(offerQuery).catch(err => console.log(err));

        offer._id = offer._id.toString()

        res.status(200).json(offer)
        return {
            props: {
                offer
            }
        }
	} catch (e) {
		console.log("Error fetching Data")
		console.error(e)

        res.status(500).json({error: "Error fetching Data"})
        return {
            props: {
                offer: null
            }
        }
	}
}