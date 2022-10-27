import clientPromise from '../../lib/mongodb'
import { getAllMensaDataFromSTW } from '../../lib/getMensaData';
import { NextApiRequest, NextApiResponse } from 'next';
import { getDates } from '../../lib/getOpeningString';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

const getMensaId = {
	'golm': 1,
	'neues-palais': 2,
	'fhp': 3,
	'brandenburg': 4,
	'filmuniversitaet': 5,
	'griebnitzsee': 6,
	'wildau': 7,
}

export const fetchDbData = async (reqDay, mensa) => {
	const selectedWeekday = reqDay
	const today = new Date();
	const currentWeekday = getDates(today).currentWeekday;
	const selectedDay = new Date(today)
	selectedDay.setDate(today.getDate() + (selectedWeekday - currentWeekday))


	const selectedDayFormatted = selectedDay.toLocaleDateString("de-DE", {year: 'numeric', month: '2-digit', day: '2-digit'})

	let foodOffers = []
	try {
		const client = await clientPromise;
		const db = client.db("guckstDuEssen");

		const coll = db.collection(mensa);

		// Get the amount of Food-Offers for the current day
		const dayQuery = {date: selectedDayFormatted}
		const dayCount = await coll.countDocuments(dayQuery)

		if (false) {
		// if (dayCount === 0) {
			// Add the current STUDENTENWERK Data to the Database
			console.log("No Data for this day, adding...")
			
			const stwData = await getAllMensaDataFromSTW(mensa);
			console.log("getting stw data", stwData)
			let sortedStwData = {};
			stwData.map((offer) => {
				sortedStwData[offer.date] = [...(sortedStwData[offer.date] || []), offer]
			})


			const getDifference = (array1, array2) => {
				return array1.filter(object1 => {
					return !array2.some(object2 => {
					return object1.beschreibung === object2.beschreibung;
					});
				});
			}


			// Cycling through each day of the STW Data and see if there are any changes to the already stored data
			Object.keys(sortedStwData).map((date) => {
				console.log(date)
				// Get MongoDB Data by date
				coll.find({date}).toArray().then((dbData) => {
					const changes = [
						...getDifference(sortedStwData[date], dbData),
						...getDifference(dbData, sortedStwData[date])
					];
					changes.map(async (change) => {
						// await supabase
						// 	.from('food_offerings')
						// 	.insert({
						// 		// Mensa ID
						// 		mensa: getMensaId[mensa],
						// 		// Title or Name of the food
						// 		food_title: change.beschreibung,
						// 		// Description of the food
						// 		food_desc: "",
						// 		// Is the food vegan?
						// 		vegan: change.labels.foodType === "vegan",
						// 		// Is the food vegetarian?
						// 		vegetarian: change.labels.foodType === "vegan" || change.labels.foodType === "vegetarisch",
						// 		// JSON Object of the nutrients
						// 		nutrients: change.nutrients,
						// 		// JSON Object of the allergens
						// 		allergens: change.allergene,
						// 	})
						// If the change has _id, it exists in MongoDB but not in STW Data
						// => It was there once, but is not anymore
						// => mark as sold out
						if(change._id){
							coll.updateOne({_id: change._id}, {$set: {soldOut: true}})
						} else {
							// If the change has no _id, it exists in STW Data but not in MongoDB
							// => It is new
							// => add to MongoDB
							coll.insertOne(change)
							// await supabase
							// .from('food_offerings')
							// .insert({
							// 	// Mensa ID
							// 	mensa: getMensaId[mensa],
							// 	// Title or Name of the food
							// 	food_title: change.beschreibung,
							// 	// Description of the food
							// 	food_desc: "",
							// 	// Is the food vegan?
							// 	vegan: change.labels.foodType === "vegan",
							// 	// Is the food vegetarian?
							// 	vegetarian: change.labels.foodType === "vegan" || change.labels.foodType === "vegetarisch",
							// 	// JSON Object of the nutrients
							// 	nutrients: change.nutrients,
							// 	// JSON Object of the allergens
							// 	allergens: change.allergene,
							// })
						}
						console.log(change._id ? "AUSVERKAUFT" : "NEU")
					})
				})
				
			})


			// await coll.insertMany(await getAllMensaDataFromSTW(mensa));
		}
		
		const cursor = coll.find(dayQuery);
		// ID Suppresion
		//const cursor = coll.find(dayQuery, {projection: {_id: 0}});
		await cursor.forEach((e) => {
			foodOffers.push(e)
		})
		// await cursor.forEach(console.log);

	} catch (e) {
		console.error(e)
	}

	// Change ID of every item in foodOffers
	foodOffers.forEach((foodOffer) => {
		foodOffer._id = foodOffer._id.toString()
	})

	return {
		foodOffers,
		selectedWeekday
	}
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const {selectedWeekday, mensa}: {selectedWeekday: 0|1|2|3|4|5, mensa: string} = req.body

    const data = await fetchDbData(selectedWeekday !== undefined ? selectedWeekday : 0, mensa ? mensa : "fhp")

    res.status(200).json(data)
  }