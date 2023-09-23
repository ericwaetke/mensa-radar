import { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../lib/getSupabaseClient";

import { getAllMensaDataFromSTW } from "../../lib/getMensaData";
import dayjs from "dayjs";
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { env } from "../../env.mjs";
dayjs.extend(isSameOrAfter.default)

import puppeteer, { executablePath } from 'puppeteer-core';

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

function allergenNumberToName(number: number): string {
	switch (number) {
		case Allergene.Eier:
			return "Eier";
		case Allergene.Erdnuesse:
			return "Erdnüsse";
		case Allergene.Fisch:
			return "Fisch";
		case Allergene.GlutenAusDinkel:
			return "Gluten aus Dinkel";
		case Allergene.GlutenAusGerste:
			return "Gluten aus Gerste";
		case Allergene.GlutenAusHafer:
			return "Gluten aus Hafer";
		case Allergene.GlutenAusKamut:
			return "Gluten aus Kamut";
		case Allergene.GlutenAusRoggen:
			return "Gluten aus Roggen";
		case Allergene.GlutenAusWeizen:
			return "Gluten aus Weizen";
		case Allergene.Haselnuesse:
			return "Haselnüsse";
		case Allergene.Krebstiere:
			return "Krebstiere";
		case Allergene.Lupinen:
			return "Lupinen";
		case Allergene.Mandeln:
			return "Mandeln";
		case Allergene.Milch:
			return "Milch";
		case Allergene.Sellerie:
			return "Sellerie";
		case Allergene.Senf:
			return "Senf";
		case Allergene.Sesam:
			return "Sesam";
		case Allergene.SchwefeldioxidUndSulfite:
			return "Schwefeldioxid und Sulfite";
		case Allergene.Soja:
			return "Soja";
		case Allergene.Weichtiere:
			return "Weichtiere";
		case Allergene.Walnuesse:
			return "Walnüsse";
		case Allergene.CashewNuesse:
			return "Cashewnüsse";
		default:
			return "Unbekannt: " + number;
	}
}

const refreshData = async (mensa: "golm" | "neues-palais" | "fhp" | "brandenburg" | "filmuniversitaet" | "griebnitzsee" | "wildau" | "cafeteria-neues-palais") => {
	// Add the current STUDENTENWERK Data to the Database
	// const stwData = await getAllMensaDataFromSTW(mensa);
	const stwData = await getNewSwpData("Kiepenheuerallee");
	let sortedStwData: {
		[date: string]: WebspeiseplanGericht[]
	} = {};
	stwData.content.map((week) => {
		week.speiseplanGerichtData.map((offer) => {
			const date = offer.speiseplanAdvancedGericht.datum = offer.speiseplanAdvancedGericht.datum.split("T")[0]
			sortedStwData[date] = [...(sortedStwData[date] || []), offer]
		})
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
			...getDifference({ data: sortedStwData[formattedDate] || [], key: "speiseplanAdvancedGericht.gerichtname" }, { data: dbData, key: "food_title" }),
			...getDifference({ data: dbData, key: "food_title" }, { data: sortedStwData[formattedDate] || [], key: "speiseplanAdvancedGericht.gerichtname" })
		];

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
				const _change = change as WebspeiseplanGericht;
				if (typeof _change.gerichtsmerkmaleIds === 'string') {
					_change.gerichtsmerkmaleIds = _change.gerichtsmerkmaleIds.split(",").map((id: string) => parseInt(id, 10));
				}
				if (typeof _change.allergeneIds === 'string') {
					_change.allergeneIds = _change.allergeneIds.split(",").map((id: string) => parseInt(id, 10));
				}
				const nutrients = Object.keys(_change.zusatzinformationen).filter((info) => info.startsWith("nw_")).map((info) => {
					const nutrientTypes = {
						nwkjInteger: "Energie (Kilojoule)",
						nwkjkcalInteger: "Energie (Kilokalorien)",
						nwfettDecimal1: "Fett",
						nwfettsaeurenDecimal1: "Fettsäuren",
						nwkohlenhydrateDecimal1: "Kohlenhydrate, resorbierbar",
						nwzuckerDecimal1: "Zucker",
						nweiweissDecimal1: "Eiweiß (Protein)",
						nwsalzDecimal1: "Salz",
					}
					return {
						name: nutrientTypes[info],
						value: _change.zusatzinformationen[info],
						unit: info.endsWith("Integer") ? "kJ" : "g"
					}
				})
				returnableChanges.push(change)
				console.log("NEW FOOD OFFERING", change)
				const newFoodOffer: FoodOffering = {
					// Mensa ID
					mensa: getMensaId[mensa],
					// Title or Name of the food
					// food_title: change.beschreibung,
					food_title: _change.speiseplanAdvancedGericht.gerichtname,
					// Description of the food
					food_desc: "",
					// Is the food vegan?
					vegan: _change.gerichtsmerkmaleIds.includes(WebspeiseplanGerichtsmerkmale.Vegan),
					// Is the food vegetarian?
					vegetarian: _change.gerichtsmerkmaleIds.includes(WebspeiseplanGerichtsmerkmale.Vegetarisch) || _change.gerichtsmerkmaleIds.includes(WebspeiseplanGerichtsmerkmale.Vegan),
					// has the food fish?
					fish: _change.gerichtsmerkmaleIds.includes(WebspeiseplanGerichtsmerkmale.Fisch),
					// has the food meat?
					meat: !_change.gerichtsmerkmaleIds.includes(WebspeiseplanGerichtsmerkmale.Vegan) && !_change.gerichtsmerkmaleIds.includes(WebspeiseplanGerichtsmerkmale.Vegetarisch) && !_change.gerichtsmerkmaleIds.includes(WebspeiseplanGerichtsmerkmale.Fisch),
					// JSON Object of the nutrients
					nutrients,
					// JSON Object of the allergens
					allergens: _change.allergeneIds.map(allergenNumberToName),

					date,

					price_students: _change.zusatzinformationen.mitarbeiterpreisDecimal2,
					price_other: _change.zusatzinformationen.gaestepreisDecimal2,
					sold_out: false,
				}
				const { data, error } = await supabase
					.from('food_offerings')
					.insert(newFoodOffer)

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

	const foodData = await getNewSwpData("Kiepenheuerallee")

	await refreshData("fhp")
	return res.status(200).json(foodData)


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


async function getNewSwpData(mensa: "Kiepenheuerallee" | "Griebnitzsee" | "Neues Palais" | "Golm" | "Wildau" | "Brandenburg" | "Filmuniversität" | "Cafeteria Neues Palais") {
	const mensaId = {
		"Kiepenheuerallee": 9604,
		"Griebnitzsee": 9601,
		"Neues Palais": 9600,
		"Filmuniversität": 9603,
	}
	const url = `https://swp.webspeiseplan.de`

	const browser = await puppeteer.launch({ headless: "new", executablePath: executablePath() });
	const page = await browser.newPage();
	await page.goto(url);

	// Wait for element to appear
	await page.waitForSelector(".locationWrapper");

	await page.select('.locationSelection', mensaId[mensa].toString())

	// Accent Modal
	await page.waitForSelector(".modal-message-content");
	await page.click("div.modal-message-wrapper div.modal-message-content div.message div.slider");
	await page.click("button.min-w-8rem");

	// Then submit the mensa selection with button .submit
	await page.click(".submit");

	// Wait for the page to load
	await page.waitForSelector(".modal-message-content");
	await page.click("button.p-h-spacer:nth-child(2)");

	return await page.evaluate(() => {

		let url = `https://swp.webspeiseplan.de/index.php?token=55ed21609e26bbf68ba2b19390bf7961&model=menu&location=9604&languagetype=1&_=${Date.now()}`;
		let response = fetch(url).then(response => response.json());


		return response
	}) as WebspeiseplanResponse
}