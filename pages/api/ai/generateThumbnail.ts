import type { NextApiRequest, NextApiResponse } from 'next'

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
				//prompt: `photorealistic, ${translatedFoodTitle}, food styling, long shot, lens 85 mm, f 11, studio photograph, ultra detailed, octane render, 8k`,
				prompt: `photorealistic, ${translatedFoodTitle}, real food, high detail, food porn, yummy, professional food photography`,
				negative_prompt: "people, nude, naked",
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
		.then(async (response) => {
			const base64image = response.images[0]
			
			res.status(200).json({
				message: 'success',
                base64: base64image
			})
        })
        .catch(e => {
            console.log(e)
            res.status(500).json({
                e
            });
        })
	} catch (e) {
		res.status(500).json({
			e
		});
	}
}