import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)


const getOpenDates = async (mensa: number) => {
	const currentDate = new Date();
	// Get the first day of the current week
	const firstDay = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));

	// Format Date to YYYY-MM-DD
	const formattedDate = firstDay.toISOString().slice(0, 10);

	// Check if there are food offers for every day in the week
	const { data, error } = await supabase
		.from('food_offerings')
		.select('date')
		.eq('mensa', mensa)
		.gt('date', formattedDate)
		.order('date', { ascending: true })

	if (error) {
		console.log('Error in getOpenDates: ', error)
		return null
	}

	// Get all dates from the response
	const dates = data.map((item) => item.date)

	// Remove duplicates
	const uniqueDates = [...new Set(dates)]

	return uniqueDates
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const request = req.body

	const mensen = await supabase
		.from('mensen')
		.select('id')
	

	const { data, error } = await supabase
		.from('current_mensa_data')
		.select()

	console.log({data, error})

	if(data.length === 0) {
		// data is not yet set or outdated
		mensen.data.map(async mensa => {
			console.log(mensa, await getOpenDates(mensa.id))

			const {data, error } = await supabase
				.from('current_mensa_data')
				.upsert({
					mensa: mensa.id,
					daysWithFood: await getOpenDates(mensa.id)
				})
				.select()

			console.log({data, error})
		})
	}

	if (error) {
		res.status(500).json({ error: error.message })
	}
	else {
		res.status(200).json({ data })
	}
}