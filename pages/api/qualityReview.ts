import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
    try {
        const request = JSON.parse(req.body);
        console.log("saving quality review", request);

        const client = await clientPromise
        const db = client.db("guckstDuEssen")
        const coll = db.collection(request.mensa);
        
        const filter = {_id: new ObjectId(request.offer)}


        let tempQualityRatings = request.qualityRatings
        // Filter Out new Rating if same sessionId has rated before
        tempQualityRatings = tempQualityRatings && tempQualityRatings?.length > 0 ? tempQualityRatings.filter(rating => rating.sessionId !== request.sessionId) : []

        let update;
        // Temporary Workaround for Food Offers which dont have rating fields yet
        if (request.offer.qualityRating) {
            update = {
                $set: {
                    "qualityRating": [...tempQualityRatings, {
                        "sessionId": request.sessionId,
                        "rating": request.rating
                    }],
                }
            }
        } else {
            update = {
                $set: {
                    "qualityRating": [...tempQualityRatings, {
                        "sessionId": request.sessionId,
                        "rating": request.rating
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