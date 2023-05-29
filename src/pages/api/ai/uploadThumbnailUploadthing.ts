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

async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
	const blob: Blob = await b64toBlob(dataUrl, 'image/png');
	return new File([blob], fileName, { type: 'image/png' });
}
function b64toBlob(base64Data, contentType) {
	contentType = contentType || '';
	var sliceSize = 1024;
	var byteCharacters = atob(base64Data);
	var bytesLength = byteCharacters.length;
	var slicesCount = Math.ceil(bytesLength / sliceSize);
	var byteArrays = new Array(slicesCount);

	for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
		var begin = sliceIndex * sliceSize;
		var end = Math.min(begin + sliceSize, bytesLength);

		var bytes = new Array(end - begin);
		for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
			bytes[i] = byteCharacters[offset].charCodeAt(0);
		}
		byteArrays[sliceIndex] = new Uint8Array(bytes);
	}
	return new Blob(byteArrays, { type: contentType });
}

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
	
	const file = await dataUrlToFile(base64, 'thumbnail.png');
	// console.log(file)

	const uploader = genUploader<OurFileRouter>()
	const imageUpload = uploader([file], "aiThumbnail", {
		url: "http://localhost:3000/api/uploadthing/",
	})

	await imageUpload
		.then(async (res) => {
			console.log(res)
			// await supabase
			// 	.from('food_offerings')
			// 	.update({ ai_thunbnail_url: res[0].fileUrl })
			// 	.eq('id', foodId)
			// 	.then(_ => {
			// 		console.log('success')
			// 	})
		})
		.catch((err) => {
			console.error("ABCD", err)
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