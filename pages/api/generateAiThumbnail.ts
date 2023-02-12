import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/getSupabaseClient';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
        const { foodTitle, foodId } = req.body

		// Translate foodTitle to english using the DeepL API
		const translatedFoodTitle = await fetch(`https://api-free.deepl.com/v2/translate?text=${foodTitle}&target_lang=en&source_lang=de`, {
			method: 'POST',
			headers: {
				'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
			},
			
		})
		.then(res => res.json())
		.then(res => res.translations[0].text)
		.catch(e => {
			console.log(e)
			return foodTitle
		})

		res.status(200).json({
			message: 'success',
			data: translatedFoodTitle
		})


		// Fetch Image from Diffuzers API
		const base64image = await fetch('https://ai.ericwaetke.de/text2img/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				prompt: `mdjrny-v4 style, photorealistic, ${foodTitle}, real food, high detail, food porn, yummy, professional food photography`,
				negative_prompt: "people",
				scheduler: "EulerAncestralDiscreteScheduler",
				image_height: 512,
				image_width: 512,
				num_images: 1,
				guidance_scale: 7,
				steps: 50,
				seed: 42
			})
		})
		.then(res => res.json())
		.then(res => res.images[0])
		const b64toBlob = (base64, type = 'image/png') => fetch(`data:${type};base64,${base64}`).then(res => res.blob())
		const blob = await b64toBlob(base64image)

		// upload the image to supabase bucket "ai_thumbnails"
		await supabase
			.storage
			.from('ai-thumbnails')
			.upload(`thumbnail_${foodId}.png`, blob)
			.then(_ => {
				res.status(200).json({
					message: 'success',
					data: _
				})
				return _
			})


	} catch (e) {
		res.status(500).json({
			e
		});
	}
}