import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/getSupabaseClient';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		// Get start and end date of current week
		const today = new Date();
		const first = today.getDate() - ((today.getDay() + 6) % 7); // First day is the day of the month - the day of the week
		const last = first + 6; // last day is the first day + 6

		// Set all food entries to has_ai_thumbnail = false
		await supabase
			.from('food_offerings')
			.update({
				has_ai_thumbnail: false
			})
			.gte('date', new Date(today.setDate(first)).toISOString().slice(0, 10))
			.lte('date', new Date(today.setDate(last)).toISOString().slice(0, 10))
			



		// Get food entries from current week from supabase
		const { data: foodEntries, error } = await supabase
			.from('food_offerings')
			.select('id, food_title, date, has_ai_thumbnail')
			.gte('date', new Date(today.setDate(first)).toISOString().slice(0, 10))
			.lte('date', new Date(today.setDate(last)).toISOString().slice(0, 10))
			.order('date', { ascending: true })
			.eq('has_ai_thumbnail', false)

		if (error) {
			res.status(500).json({
				error
			})
		}

		// Cycle through food entries and generate thumbnails
		const foodEntriesWithThumbnails = await Promise.all(foodEntries.map(async (foodEntry) => {
			// Generate thumbnail if it doesn't exist yet
			if(!foodEntry.has_ai_thumbnail || true) {
				fetch(`${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://mensa-radar.de"}/api/generateAiThumbnail`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						foodTitle: foodEntry.food_title,
						foodId: foodEntry.id
					})
				})
					.then(res => res.json())
					.then(async (res) => {
						if (res.message === 'success') {
						// Update has_ai_thumbnail column in supabase
							await supabase
								.from('food_offerings')
								.update({ has_ai_thumbnail: true })
								.eq('id', foodEntry.id)
								.then(_ => {
									console.log('success')
								})
						}
					})
			}
		})).then(_ => {
			res.status(200).json({
				message: 'success',
				data: _
			})
		})
	} catch (e) {
		res.status(500).json({
			e
		});
	}
}