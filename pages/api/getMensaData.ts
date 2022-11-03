import { getAllMensaDataFromSTW } from '../../lib/getMensaData';
import { NextApiRequest, NextApiResponse } from 'next';
import { getDates } from '../../lib/getOpeningString';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
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


	// const selectedDayFormatted = selectedDay.toLocaleDateString("de-DE", {year: 'numeric', month: '2-digit', day: '2-digit'})
	// const dateFormated = `${change.date.split(".")[2]}-${change.date.split(".")[1]}-${change.date.split(".")[0]}`
	const dateFormated = selectedDay.toISOString().split('T')[0]

	let foodOffers = []
	try {
			// Add the current STUDENTENWERK Data to the Database
			
			const stwData = await getAllMensaDataFromSTW(mensa);
			let sortedStwData = {};
			stwData.map((offer) => {
				sortedStwData[offer.date] = [...(sortedStwData[offer.date] || []), offer]
			})


			const getDifference = (obj1: {data: any[], key: string}, obj2: {data: any[], key: string}) => {
				return obj1.data.filter(object1 => {
					return !obj2.data.some(object2 => {
					return object1[obj1.key] === object2[obj2.key];
					});
				});
			}


			// Cycling through each day of the STW Data and see if there are any changes to the already stored data
			Object.keys(sortedStwData).map(async (date) => {
				// Get MongoDB Data by date
				const { data: dbData, error } = await supabase
					.from('food_offerings')
					.select('*')
					.eq('date', `${date.split(".")[2]}-${date.split(".")[1]}-${date.split(".")[0]}`)
					.eq('mensa', getMensaId[mensa])

				console.error(error)

				// Compare the two arrays
				const changes = [
					...getDifference({data: sortedStwData[date], key: "beschreibung"}, {data: dbData, key: "food_title"}),
					...getDifference({data: dbData, key: "food_title"}, {data: sortedStwData[date], key: "beschreibung"})
				];
				changes.map(async (change) => {
					// If the change has _id, it exists in MongoDB but not in STW Data
					// => It was there once, but is not anymore
					// => mark as sold out
					if(change.id){
						// If change is in the future, delete it
						if(change.date > dateFormated){
							const {data, error } = await supabase
							.from('food_offerings')
							.update({
								...change,
								sold_out: true,
								changed_at: new Date()
							})
							.eq('id', change.id)
	
							console.log(error)
						}

						else {
							// Delete the food offering
							const { data, error } = await supabase
								.from('food_offerings')
								.delete()
								.eq('id', change.id)
							console.log(error)
						}
					} else {
						// If the change has no _id, it exists in STW Data but not in MongoDB
						// => It is new
						// => add to MongoDB
						const {data, error } = await supabase
						.from('food_offerings')
						.insert({
							// Mensa ID
							mensa: getMensaId[mensa],
							// Title or Name of the food
							food_title: change.beschreibung,
							// Description of the food
							food_desc: "",
							// Is the food vegan?
							vegan: change.labels?.foodType === "vegan",
							// Is the food vegetarian?
							vegetarian: change.labels?.foodType === "vegan" || change.labels?.foodType === "vegetarisch",
							// JSON Object of the nutrients
							nutrients: change.nutrients,
							// JSON Object of the allergens
							allergens: change.allergene,

							date: `${date.split(".")[2]}-${date.split(".")[1]}-${date.split(".")[0]}`,

							price_students: change.preise.preis_s[0],
							price_other: change.preise.preis_g[0],
						})

						console.log(error)
					}
				})
			})
				
			


			// await coll.insertMany(await getAllMensaDataFromSTW(mensa));
		
			const { data: foodOfferingsOfSelectedDay, error } = await supabase
				.from('food_offerings')
				.select()
				.eq('date', dateFormated)
				.eq('mensa', getMensaId[mensa])
		
			console.error(error)
			await foodOfferingsOfSelectedDay.forEach((e) => {
				foodOffers.push(e)
			})

	} catch (e) {
		console.error(e)
	}

	return {
		foodOffers,
		selectedWeekday
	}
}

export default async (req: NextApiRequest, res: NextApiResponse) => {

	console.log("API Request")
	console.log(req.body)

	const {selectedWeekday, mensa}: {selectedWeekday: 0|1|2|3|4|5, mensa: string} = JSON.parse(req.body)

    const data = await fetchDbData(selectedWeekday !== undefined ? selectedWeekday : 0, mensa ? mensa : "fhp")

    res.status(200).json(data)
  }