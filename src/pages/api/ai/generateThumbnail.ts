import type { NextApiRequest, NextApiResponse } from 'next';
import { generateSeed } from '../../../lib/generateSeed';
import { env } from '../../../env.mjs';

import WebSocket from 'ws';

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
		.replace(/[xy]/g, function (c) {
			const r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
}

const GenerateThumbnail = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const { foodTitle, foodId } = JSON.parse(req.body);

		// Translate foodTitle to english using the DeepL API
		const translatedFoodTitle = await fetch(`https://api-free.deepl.com/v2/translate?text=${foodTitle}&target_lang=en&source_lang=de`, {
			method: 'POST',
			headers: {
				'Authorization': `DeepL-Auth-Key ${env.DEEPL_API_KEY}`,
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

		type PromptResponse = {

			prompt_id: string,
			number: number,
			node_errors: any
		}
		const prompt = {
			4: {
				inputs: {
					ckpt_name: "sd_xl_refiner_1.0.safetensors"
				},
				class_type: "CheckpointLoaderSimple"
			},
			5: {
				inputs: {
					width: 1024,
					height: 1024,
					batch_size: 1
				},
				class_type: "EmptyLatentImage"
			},
			8: {
				inputs: {
					samples: [
						"23",
						0
					],
					vae: [
						"4",
						2
					]
				},
				class_type: "VAEDecode"
			},
			10: {
				inputs: {
					ckpt_name: "sd_xl_base_1.0.safetensors"
				},
				class_type: "CheckpointLoaderSimple"
			},
			22: {
				inputs: {
					add_noise: "enable",
					noise_seed: generateSeed(16),
					steps: 20,
					cfg: 7.5,
					sampler_name: "ddim",
					scheduler: "normal",
					start_at_step: 0,
					end_at_step: 20,
					return_with_leftover_noise: "enable",
					model: [
						"10",
						0
					],
					positive: [
						"75",
						0
					],
					negative: [
						"82",
						0
					],
					latent_image: [
						"5",
						0
					]
				},
				class_type: "KSamplerAdvanced"
			},
			23: {
				inputs: {
					add_noise: "disable",
					noise_seed: 454,
					steps: 20,
					cfg: 7.5,
					sampler_name: "euler",
					scheduler: "normal",
					start_at_step: 20,
					end_at_step: 1000,
					return_with_leftover_noise: "disable",
					model: [
						"4",
						0
					],
					positive: [
						"120",
						0
					],
					negative: [
						"81",
						0
					],
					latent_image: [
						"22",
						0
					]
				},
				class_type: "KSamplerAdvanced"
			},
			75: {
				inputs: {
					width: 2048,
					height: 2048,
					crop_w: 0,
					crop_h: 0,
					target_width: 2048,
					target_height: 2048,
					text_g: `An image of the dish ${translatedFoodTitle}`,
					text_l: "centered, head on, canteen, close up, realistic, real food, high detail, canteen food, professional food photography, single plate",
					clip: [
						"10",
						1
					]
				},
				class_type: "CLIPTextEncodeSDXL"
			},
			81: {
				inputs: {
					ascore: 2,
					width: 2048,
					height: 2048,
					text: "noise, grit, dull, washed out, low contrast, blurry, hazy, malformed, warped, deformed, cartoon, illustration",
					clip: [
						"4",
						1
					]
				},
				class_type: "CLIPTextEncodeSDXLRefiner"
			},
			82: {
				inputs: {
					width: 2048,
					height: 2048,
					crop_w: 0,
					crop_h: 0,
					target_width: 2048,
					target_height: 2048,
					text_g: "noise, grit, dull, washed out, low contrast, blurry, hazy, malformed, warped, deformed, cartoon, illustration",
					text_l: "noise, grit, dull, washed out, low contrast, blurry, hazy, malformed, warped, deformed, cartoon, illustration",
					clip: [
						"10",
						1
					]
				},
				class_type: "CLIPTextEncodeSDXL"
			},
			120: {
				inputs: {
					ascore: 6,
					width: 2048,
					height: 2048,
					text: "centered, head on, canteen, close up, realistic, real food, high detail, canteen food, professional food photography, single plate",
					clip: [
						"4",
						1
					]
				},
				class_type: "CLIPTextEncodeSDXLRefiner"
			},
			184: {
				inputs: {
					filename_prefix: "ComfyUI",
					images: [
						"8",
						0
					]
				},
				class_type: "SaveImage"
			}
		}

		const clientId = uuidv4()
		console.log(clientId)
		let webSocket = new WebSocket("wss://ai.ericwaetke.de/ws?clientId=" + clientId);
		let promtResponse: PromptResponse = null;
		webSocket.onopen = async (e) => {
			console.log("WebSocket connected")
			promtResponse = await fetch('https://ai.ericwaetke.de/prompt', { method: 'POST', body: JSON.stringify({ prompt: prompt, client_id: clientId }) }).then(res => { return res.json() }).catch(e => console.log(e))
		}
		webSocket.onerror = (e) => {
			console.log("WebSocket error", e)
		}

		webSocket.onmessage = async (event) => {
			const data = event.data ? JSON.parse(event.data.toString()) : null;
			// console.log(data)

			if (data.type === "executed") {
				const { filename, subfolder, type } = data.data.output.images[0]
				const image = await fetch(`https://ai.ericwaetke.de/view?filename=${filename}&subfolder=${subfolder}&type=${type}`).then(res => res.blob())
				console.log(image)
				// Repond with image blob

				// res.setHeader('Content-Type', image.type)
				// res.setHeader('Content-Length', image.size)
				// res.send(image);
				res.writeHead(200, {
					'Content-Type': `image/png`,
					'Cache-Control': `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
				});

				res.end(Buffer.from(await image.arrayBuffer()));
				// res.status(200).send(image)
			}
		};

		async function getImage(filename: string, subfolder: string, type: string) {
			// const base64 = await blobToBase64(image)
			// console.log(base64)
			// res.status(200).json({
			// 	message: 'success',
			// 	base64: URL.createObjectURL(image)
			// })
		}

		// await fetch('http://ai.ericwaetke.de:10000/text2img/', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({
		// 		//prompt: `photorealistic, ${translatedFoodTitle}, food styling, long shot, lens 85 mm, f 11, studio photograph, ultra detailed, octane render, 8k`,
		// 		prompt: `photorealistic, ${translatedFoodTitle}, real food, high detail, canteen food, professional food photography`,
		// 		negative_prompt: "people, nude, naked",
		// 		scheduler: "EulerAncestralDiscreteScheduler",
		// 		image_height: 512,
		// 		image_width: 512,
		// 		num_images: 1,
		// 		guidance_scale: 7,
		// 		steps: 50,
		// 		seed: generateSeed(16)
		// 	})
		// })
		// 	.then(res => res.json())
		// 	.then(async (response) => {
		// 		const base64image = response.images[0]

		// 		res.status(200).json({
		// 			message: 'success',
		// 			base64: base64image
		// 		})
		// 	})
		// 	.catch(e => {
		// 		console.log(e)
		// 		res.status(500).json({
		// 			e
		// 		});
		// 	})
	} catch (e) {
		res.status(500).json({
			e
		});
	}
}

export default GenerateThumbnail;