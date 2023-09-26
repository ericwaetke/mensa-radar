import { getAllMensaDataFromSTW } from '../../lib/getMensaData';
import { NextApiRequest, NextApiResponse } from 'next';
import { getDates } from '../../lib/getOpeningString';
import { createClient } from '@supabase/supabase-js';
import { env } from '../../env.mjs';
import { NextRequest } from 'next/server';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

export const config = {
	runtime: 'experimental-edge', // this is a pre-requisite
	regions: ['fra1'], // only execute this function on iad1
};

const getMensaId = {
	'golm': 1,
	'neues-palais': 2,
	'fhp': 3,
	'brandenburg': 4,
	'filmuniversitaet': 5,
	'griebnitzsee': 6,
	'wildau': 7,
	"cafeteria-neues-palais": 8
}

export const fetchDbData = async (reqDay: number, mensa: string) => {
	const selectedWeekday = reqDay
	const today = new Date();
	const currentWeekday = getDates(today).currentWeekday;

	// Get selected date from offset
	let selectedDay = new Date()
	selectedDay.setDate(selectedDay.getDate() + (selectedWeekday - currentWeekday))

	// const selectedDayFormatted = selectedDay.toLocaleDateString("de-DE", {year: 'numeric', month: '2-digit', day: '2-digit'})
	// const dateFormated = `${change.date.split(".")[2]}-${change.date.split(".")[1]}-${change.date.split(".")[0]}`
	const dateFormated = selectedDay.toISOString().split('T')[0]

	let foodOffers = []
	try {
		const { data: foodOfferingsOfSelectedDay, error } = await supabase
			.from('food_offerings')
			.select(`*, food_images ( image_url )`)
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

const GetMensaData = async (req: NextRequest) => {
	const { selectedWeekday, mensa }: { selectedWeekday: -1 | 0 | 1 | 2 | 3 | 4 | 5, mensa: string } = await req.json() || { selectedWeekday: -1, mensa: "undefined" }

	if (selectedWeekday === -1 && mensa === "undefined")
		return new Response(JSON.stringify({ error: "No data found" }), { status: 400 })

	const data = await fetchDbData(selectedWeekday !== undefined ? selectedWeekday : 0, mensa ? mensa : "fhp")

	if (data) {
		return new Response(JSON.stringify(data), { status: 200 })
	}
	return new Response(JSON.stringify({ error: "No data found" }), { status: 400 })
}

export default GetMensaData