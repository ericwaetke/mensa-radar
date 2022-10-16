import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const request = req.body

	const {mensa}: {mensa: string} = JSON.parse(request)
	
	const client = await clientPromise;
	const db = client.db("guckstDuEssen");

	const collection = db.collection(mensa);

	// Get current date
	// Date format: DD.MM.YYYY
	const currentDate = new Date();
	const currentDay = currentDate.getDate();
	const currentMonth = currentDate.getMonth() + 1;
	const currentYear = currentDate.getFullYear();

	const fillZero = (number: number) => (number < 10 ? `0${number}` : number);
	const currentDateFormatted = (day, month, year) => `${fillZero(day)}.${fillZero(month)}.${year}`


	return new Promise<void>(async (resolve, reject) => {
		
		// offer today?
		const offerToday: boolean = await collection.find({date: currentDateFormatted(currentDay, currentMonth, currentYear)}).count().then(count => count > 0);

		// Start Request with tomorrow
		collection.find({date: currentDateFormatted(currentDay + 1, currentMonth, currentYear)}).count().then((count) => {
			if (count > 0) {
				res.status(200).json({offerToday, daysUntilNextOffer: 1})
				return resolve()
			} else {
				// No offers, so check the next day
				collection.find({date: currentDateFormatted(currentDay + 2, currentMonth, currentYear)}).count().then((count) => {
					if (count > 0) {
						res.status(200).json({offerToday, daysUntilNextOffer: 2})
						return resolve()
					} else {
						// No offers, so check the next day
						collection.find({date: currentDateFormatted(currentDay + 3, currentMonth, currentYear)}).count().then((count) => {
							if (count > 0) {
								res.status(200).json({offerToday, daysUntilNextOffer: 3})
								return resolve()
							} else {
								// No offers, so check the next day
								collection.find({date: currentDateFormatted(currentDay + 4, currentMonth, currentYear)}).count().then((count) => {
									if (count > 0) {
										res.status(200).json({offerToday, daysUntilNextOffer: 4})
										return resolve()
									} else {
										// No offers, so check the next day
										collection.find({date: currentDateFormatted(currentDay + 5, currentMonth, currentYear)}).count().then((count) => {
											if (count > 0) {
												res.status(200).json({offerToday, daysUntilNextOffer: 5})
												return resolve()
											} else {
												// No offers, so return -1 since this week will have no more food
												res.status(200).json({offerToday, daysUntilNextOffer: -1})
												return resolve()
											}
										})
									}
								})
							}
						})
					}
				})
			}
		})

	})
}
