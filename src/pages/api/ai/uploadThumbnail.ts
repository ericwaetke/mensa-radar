import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/getSupabaseClient';
import { decode } from 'base64-arraybuffer';
import { DANGEROUS__uploadFiles } from 'uploadthing/client';
import { genUploader } from 'uploadthing/client';
import { OurFileRouter } from '../../../server/uploadthing';
import { NextRequest } from 'next/server';

export const config = {
	runtime: 'experimental-edge', // this is a pre-requisite
	regions: ['fra1'], // only execute this function on iad1
};

const UploadThumbnail = async (req: NextRequest) => {
	if (req.method !== "POST")
		return new Response(null, { status: 404, statusText: "Not Found" });
	let foodId, base64;
	try {
		const body = await req.json();
		foodId = body.foodId
		base64 = body.base64
	} catch (e) {
		console.error(e)
		new Response(e)
	}

	if (!foodId || !base64) {
		return new Response(JSON.stringify(
			{
				message: 'foodId and base64 are required',
			}
		), {
			status: 400,
		})
	}

	var url = "data:image/png;base64," + base64;
	async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
		const res: Response = await fetch(dataUrl);
		const blob: Blob = await res.blob();
		return new File([blob], fileName, { type: 'image/png' });
	}
	const file = await dataUrlToFile(url, 'thumbnail.png');
	console.log(file)

	const uploader = genUploader<OurFileRouter>()
	const imageUpload = uploader([file], "aiThumbnail", {
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


	return new Response(JSON.stringify(
		{
			message: 'success',
		}
	), {
		status: 200,
	})
}

export default UploadThumbnail