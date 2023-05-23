import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/getSupabaseClient';
import { decode } from 'base64-arraybuffer';
import { DANGEROUS__uploadFiles } from 'uploadthing/client';
import { genUploader } from 'uploadthing/client';
import { OurFileRouter } from '../../../server/uploadthing';


const UploadThumbnail = async (req: NextApiRequest, res: NextApiResponse) => {
	let foodId, base64;
	try {
		const body= JSON.parse(req.body) || req.body;
		foodId = body.foodId
		base64 = body.base64
	} catch (e) {
		res.status(500).json({
			e,
			message: "Error destructuring body?",
		});
	}

	if (!foodId || !base64) {
		res.status(400).json({
			message: 'foodId and base64 are required',
		});
		return;
	}

	const buffer = await decode(base64)
	const blob = new Blob([buffer], { type: 'image/png' })
	const f = {
		name: 'test.png',
		type: 'blob',
		size: blob.size,
		lastModified: Date.now(),
		...blob
	}

	const uploader = genUploader<OurFileRouter>()
	const imageUpload = uploader([f as File], "aiThumbnail", {
		url: "http://localhost:3000/api/uploadthing/",
	})

	imageUpload.then(async (res) => {
		console.log(res)
		// await supabase
		// 	.from('food_offerings')
		// 	.update({ ai_thunbnail_url: res[0].fileUrl })
		// 	.eq('id', foodId)
		// 	.then(_ => {
		// 		console.log('success')
		// 	})
	})


	res.status(200).json({
		message: 'success',
	})
}

export default UploadThumbnail