import { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../lib/getSupabaseClient";

import { getAllMensaDataFromSTW } from "../../lib/getMensaData";
import dayjs from "dayjs";
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { env } from "../../env.mjs";
dayjs.extend(isSameOrAfter.default)

const getMensaId = {
	'golm': 1,
	'neues-palais': 2,
	'fhp': 3,
	'brandenburg': 4,
	'filmuniversitaet': 5,
	'griebnitzsee': 6,
	'wildau': 7,
	'cafeteria-neues-palais': 8,
}

function getRemainingDaysOfWeek(): string[] {
	const daysOfWeek: string[] = [];
	const today: Date = new Date();

	// Calculate the number of days until Sunday (0: Sunday, 1: Monday, ..., 6: Saturday)
	const daysUntilSunday: number = (7 - today.getDay()) % 7;

	for (let i = 0; i <= daysUntilSunday; i++) {
		const nextDay: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1 + i);
		const formattedDate: string = nextDay.toISOString().slice(0, 10);
		daysOfWeek.push(formattedDate);
	}

	return daysOfWeek;
}

function getDifference(obj1: { data: any[], key: string }, obj2: { data: any[], key: string }): any[] {
	return obj1.data?.filter(object1 => {
		return !obj2.data.some(object2 => {
			return object1[obj1.key] === object2[obj2.key];
		});
	});
}

const refreshData = async (mensa: string) => {
	// Add the current STUDENTENWERK Data to the Database
	const stwData = await getAllMensaDataFromSTW(mensa);
	let sortedStwData = {};
	stwData.map((offer) => {
		sortedStwData[offer.date] = [...(sortedStwData[offer.date] || []), offer]
	})
	let returnableChanges = [];
	// Cycling through each day of the STW Data and see if there are any changes to the already stored data
	getRemainingDaysOfWeek().map(async (date) => {

		const { data: dbData, error } = await supabase
			.from('food_offerings')
			.select('*')
			.eq('date', date)
			.eq('mensa', getMensaId[mensa])

		if (error) {
			console.log("Error in refreshMensaData.ts getting the data from Supabase")
			console.error(error)
			throw new Error()
		}

		const formattedDate = `${date.split("-")[2]}.${date.split("-")[1]}.${date.split("-")[0]}`
		// No data for this day
		if (sortedStwData[formattedDate] === undefined) {
			if (dbData.length > 0) {
				console.log("No data for this day, but data in DB", formattedDate)
				// Delete all data for this day
				const { data, error } = await supabase
					.from('food_offerings')
					.delete()
					.eq('date', date)
					.eq('mensa', getMensaId[mensa])

				if (error) {
					console.log("Error in refreshMensaData.ts deleting the data from Supabase")
					console.error(error)
					throw new Error()
				}
			}
		}


		// Compare the two arrays
		const changes = [
			...getDifference({ data: sortedStwData[formattedDate] || [], key: "beschreibung" }, { data: dbData, key: "food_title" }),
			...getDifference({ data: dbData, key: "food_title" }, { data: sortedStwData[formattedDate] || [], key: "beschreibung" })
		];
		console.log(changes)
		changes.map(async (change) => {
			// If the change has _id, it exists in MongoDB but not in STW Data
			// => It was there once, but is not anymore
			// => mark as sold out
			if (change.id) {
				// If change is in the future, delete it
				if (dayjs().isSame(change.date, 'day')) {
					console.log("isSameOrAfter = soldout: " + change.date)
					const { data, error } = await supabase
						.from('food_offerings')
						.update({
							...change,
							sold_out: true,
							changed_at: new Date()
						})
						.eq('id', change.id)

					if (error) {
						console.log("Error in refreshMensaData.ts updating the sold out offer")
						console.error(error)
						return {
							statusCode: 500,
							body: { error: error }
						}
					}
				} else {
					console.log("not same or after = delete: " + change.date)
					// Change is in the future, delete it
					const { data, error } = await supabase
						.from('food_offerings')
						.delete()
						.eq('id', change.id)

					if (error) {
						console.log("Error in refreshMensaData.ts deleting the sold out offer")
						console.error(error)
						return {
							statusCode: 500,
							body: { error: error }
						}
					}
				}

			} else {
				returnableChanges.push(change)
				console.log("NEW FOOD OFFERING", change)
				const { data, error } = await supabase
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
						// has the food fish?
						fish: change.labels?.foodType === "Fisch",
						// has the food meat?
						meat: change.labels?.foodType !== "vegan" && change.labels?.foodType !== "vegetarisch" && change.labels?.foodType !== "Fisch",
						// JSON Object of the nutrients
						nutrients: change.nutrients,
						// JSON Object of the allergens
						allergens: change.allergene,

						date,

						price_students: change.preise.preis_s[0],
						price_other: change.preise.preis_g[0],
					})

				if (error) {
					console.log("Error in refreshMensaData.ts inserting the new offer")
					console.error(error)
					return {
						statusCode: 500,
						body: { error: error }
					}
				}
				else if (data) {
					return {
						statusCode: 200,
						body: { data: { data, changes } }
					}
				}
			}
		})
	})
	return returnableChanges
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Check for secret to confirm this is a valid request

	if (req.headers.authorization !== `Bearer ${env.REVALIDATION_TOKEN}`) {
		return res.status(401).json({ message: 'Invalid token: ' + req.headers.authorization })
	}

	try {
		const { data: mensaData } = await supabase
			.from("mensen")
			.select('url')

		await Promise.all(
			mensaData.map(async mensa => {
				return refreshData(mensa.url)
			})
		)
			.then((data) => {
				return res.status(200).json({ revalidated: true, data: data })
			})

		// refreshData("fhp")
		// 	.then((data) => res.status(200).json({ revalidated: true, data: data }))
	} catch (err) {
		// If there was an error, Next.js will continue
		// to show the last successfully generated page
		return res.status(500).send({ message: 'Error revalidating', data: err })
	}
}
