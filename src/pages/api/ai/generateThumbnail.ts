import type { NextApiRequest, NextApiResponse } from 'next';
import { generateSeed } from '../../../lib/generateSeed';
import { env } from '../../../env.mjs';

import WebSocket from 'ws';

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
		const prompt = `{
			"prompt": {
				"4": {
					"inputs": {
						"ckpt_name": "sd_xl_refiner_1.0.safetensors"
					},
					"class_type": "CheckpointLoaderSimple"
				},
			  "5": {
				"inputs": {
				  "width": 1024,
				  "height": 1024,
				  "batch_size": 1
				},
				"class_type": "EmptyLatentImage"
			  },
			  "8": {
				"inputs": {
				  "samples": [
					"23",
					0
				  ],
				  "vae": [
					"4",
					2
				  ]
				},
				"class_type": "VAEDecode"
			  },
			  "10": {
				"inputs": {
				  "ckpt_name": "sd_xl_base_1.0.safetensors"
				},
				"class_type": "CheckpointLoaderSimple"
			  },
			  "22": {
				"inputs": {
				  "add_noise": "enable",
				  "noise_seed": 454,
				  "steps": 20,
				  "cfg": 7.5,
				  "sampler_name": "ddim",
				  "scheduler": "normal",
				  "start_at_step": 0,
				  "end_at_step": 20,
				  "return_with_leftover_noise": "enable",
				  "model": [
					"10",
					0
				  ],
				  "positive": [
					"75",
					0
				  ],
				  "negative": [
					"82",
					0
				  ],
				  "latent_image": [
					"5",
					0
				  ]
				},
				"class_type": "KSamplerAdvanced"
			  },
			  "23": {
				"inputs": {
				  "add_noise": "disable",
				  "noise_seed": 454,
				  "steps": 20,
				  "cfg": 7.5,
				  "sampler_name": "euler",
				  "scheduler": "normal",
				  "start_at_step": 20,
				  "end_at_step": 1000,
				  "return_with_leftover_noise": "disable",
				  "model": [
					"4",
					0
				  ],
				  "positive": [
					"120",
					0
				  ],
				  "negative": [
					"81",
					0
				  ],
				  "latent_image": [
					"22",
					0
				  ]
				},
				"class_type": "KSamplerAdvanced"
			  },
			  "75": {
				"inputs": {
				  "width": 2048,
				  "height": 2048,
				  "crop_w": 0,
				  "crop_h": 0,
				  "target_width": 2048,
				  "target_height": 2048,
				  "text_g": "An image of the dish ${translatedFoodTitle}",
				  "text_l": "centered, head on, canteen, close up, realistic, real food, high detail, canteen food, professional food photography, single plate",
				  "clip": [
					"10",
					1
				  ]
				},
				"class_type": "CLIPTextEncodeSDXL"
			  },
			  "81": {
				"inputs": {
				  "ascore": 2,
				  "width": 2048,
				  "height": 2048,
				  "text": "noise, grit, dull, washed out, low contrast, blurry, hazy, malformed, warped, deformed, cartoon, illustration",
				  "clip": [
					"4",
					1
				  ]
				},
				"class_type": "CLIPTextEncodeSDXLRefiner"
			  },
			  "82": {
				"inputs": {
				  "width": 2048,
				  "height": 2048,
				  "crop_w": 0,
				  "crop_h": 0,
				  "target_width": 2048,
				  "target_height": 2048,
				  "text_g": "noise, grit, dull, washed out, low contrast, blurry, hazy, malformed, warped, deformed, cartoon, illustration",
				  "text_l": "noise, grit, dull, washed out, low contrast, blurry, hazy, malformed, warped, deformed, cartoon, illustration",
				  "clip": [
					"10",
					1
				  ]
				},
				"class_type": "CLIPTextEncodeSDXL"
			  },
			  "120": {
				"inputs": {
				  "ascore": 6,
				  "width": 2048,
				  "height": 2048,
				  "text": "centered, head on, canteen, close up, realistic, real food, high detail, canteen food, professional food photography, single plate",
				  "clip": [
					"4",
					1
				  ]
				},
				"class_type": "CLIPTextEncodeSDXLRefiner"
			  },
			  "184": {
				"inputs": {
				  "filename_prefix": "ComfyUI",
				  "images": [
					"8",
					0
				  ]
				},
				"class_type": "SaveImage"
			  }
			}
		  }`

		const webSocket = new WebSocket("ws://127.0.0.1:8188/ws?client=MensaRadarInstance");

		const promtResponse: PromptResponse = await fetch('http://127.0.0.1:8188/prompt', { method: 'POST', body: prompt }).then(res => { console.log(res); return res.json() }).catch(e => console.log(e))

		let progress = 0;
		webSocket.onmessage = (event) => {
			const data = JSON.parse(event.data)
			if (data.type === "progress") {
				progress = data.data.value / data.data.max
			} else if (data.type === "status" && progress === 1) {
				progress = 0;
				getImage()
				webSocket.close()
			}
		};

		async function getImage() {
			const history = await fetch(`http://127.0.0.1:8188/history/${promtResponse.prompt_id}/`).then({
				return res => res.json()
			}).catch(e => console.log(e))
			const { filename, subfolder, type } = history[promtResponse.prompt_id].outputs["184"][0]
			console.log(filename, subfolder, type)
			const image = await fetch(`http://127.0.0.1:8188/view?filename=${filename}&subfolder=${subfolder}&type=${type}`).then(res => res.blob())
			res.status(200).json({
				message: 'success',
				base64: URL.createObjectURL(image)
			})
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