import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/getSupabaseClient';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
        const { foodTitle, foodId } = JSON.parse(req.body);

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
		// foodtitle + "one centered plate, real food, high detail, food porn, yummy, professional food photography"

		// Fetch Image from Diffuzers API
		await fetch('http://ai.ericwaetke.de:10000/text2img/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				prompt: `photorealistic, ${translatedFoodTitle}, real food, high detail, food porn, yummy, professional food photography`,
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
		.then(async (res) => {
			const base64image = res.images[0]
			
			const b64toBlob = (base64, type = 'image/png') => fetch(`data:${type};base64,${base64}`).then(res => res.blob())
			const blob = await b64toBlob(base64image)
	
			// upload the image to supabase bucket "ai_thumbnails"
			await supabase
				.storage
				.from('ai-thumbnails')
				.upload(`thumbnail_${foodId}.png`, blob)
				.then(async _ => {
					console.log("uploaded image to supabase")
					await supabase
							.from('food_offerings')
							.update({ has_ai_thumbnail: true })
							.eq('id', foodId)
							.then(_ => {
								console.log('success')
							})
				})
				.catch(e => {
					console.log(e)
					throw e
				})
			})
					
			res.status(200).json({
				message: 'success',
			})
	} catch (e) {
		res.status(500).json({
			e
		});
	}
}