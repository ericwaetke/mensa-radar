import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
    try {
        const request = JSON.parse(req.body);
        console.log(request);

        const client = await clientPromise
        const db = client.db("guckstDuEssen")
        const coll = db.collection(request.mensa);

        const filter = {_id: new ObjectId(request.offer)}

        let tempAmountRating = request.amountRatings
        // Filter Out new Rating if same sessionId has rated before
        console.log(tempAmountRating)
        tempAmountRating = tempAmountRating && tempAmountRating?.length > 0 ? tempAmountRating.filter(rating => rating.sessionId !== request.sessionId) : []
        console.log(tempAmountRating)

        let update;
        // Temporary Workaround for Food Offers which dont have rating fields yet
        if (request.offer.amountRating) {
            update = {
                $set: {
                    "amountRating": [...tempAmountRating, {
                        "sessionId": request.sessionId,
                        "rating": request.rating
                    }],
                }
            }
        } else {
            update = {
                $set: {
                    "amountRating": [...tempAmountRating, {
                        "sessionId": request.sessionId,
                        "rating": request.rating
                    }],
                }
            }
        }

        const result = await coll.updateOne(filter, update)
        res.status(200).json({result});

    } catch (error) {
        console.error(error)
        res.status(500).json({ text: JSON.stringify(error)});
    }
}