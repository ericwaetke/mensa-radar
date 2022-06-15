import { ObjectId } from 'mongodb';
import clientPromise from '/lib/mongodb'

export default async function handler(req, res) {
    try {
            
        const client = await clientPromise
        const db = client.db("guckstDuEssen")
        const coll = db.collection(req.body.mensa);
        
        const filter = {_id: ObjectId(req.body.offer._id)}

        let update;
        // Temporary Workaround for Food Offers which dont have rating fields yet
        if (req.body.offer.qualityRating) {
            update = {
                $set: {
                    "qualityRating": [...req.body.offer.qualityRating, {
                        "sessionId": req.body.sessionId,
                        "rating": req.body.rating
                    }],
                }
            }
        } else {
            update = {
                $set: {
                    "qualityRating": [{
                        "sessionId": req.body.sessionId,
                        "rating": req.body.rating
                    }],
                }
            }
        }

        const result = await coll.updateOne(filter, update)
        res.status(200).json({ text: result});

    } catch (error) {
        console.error(error)
        res.status(500).json({ text: JSON.stringify(error)});
    }
}