import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/getSupabaseClient';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const { foodId, base64 } = JSON.parse(req.body) || req.body;
		if (!foodId || !base64) {
			res.status(400).json({
				message: 'foodId and base64 are required',
			});
			return;
		}

		// const b64toBlob = (base64, type = 'image/png') => fetch(`data:${type};base64,${base64}`).then(res => res.blob())
		// const blob = await b64toBlob(base64)

		// await supabase
		// 	.storage
		// 	.from('ai-thumbnails')
		// 	.upload(`thumbnail_${foodId}.png`, blob)
		// 	.then(async _ => {
		// 		console.log("uploaded image to supabase")
		// 		await supabase
		// 			.from('food_offerings')
		// 			.update({ has_ai_thumbnail: true })
		// 			.eq('id', foodId)
		// 			.then(_ => {
		// 				console.log('success')
		// 			})
		// 	})
		// 	.catch(e => {
		// 		res.status(500).json({
		// 			error: e.json(),
		// 			message: "Error while uploading image to supabase"
		// 		});
		// 		console.log(e)
		// 		throw e
		// 	})


		res.status(200).json({
			message: 'success',
			foodId,
		})
	} catch (e) {
		res.status(500).json({
			e,
			message: "Error destructuring body?",
		});
	}
}
