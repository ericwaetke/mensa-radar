import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/getSupabaseClient';
import { decode } from 'base64-arraybuffer';
import { NextRequest } from 'next/server';

export const config = {
	runtime: 'experimental-edge', // this is a pre-requisite
	regions: ['fra1'], // only execute this function on iad1
};

const UploadThumbnail = async (req: NextRequest) => {
	const { foodId, base64 } = await req.json();

	if (!foodId || !base64) {
		return new Response(JSON.stringify({
			message: 'foodId and base64 are required',
		}), {
			status: 400,
		})
	}

	const buffer = await decode(base64)

	await supabase
		.storage
		.from('ai-thumbnails')
		.upload(`thumbnail_${foodId}.png`, buffer, {
			contentType: 'image/png',
		})
		.then(async _ => {
			console.log("uploaded image to supabase")
			await supabase
				.from('food_offerings')
				.update({ has_ai_thumbnail: true })
				.eq('id', foodId)
				.then(_ => {
					return new Response(JSON.stringify({
						message: 'uploaded to supabase',
					}), {
						status: 200,
					})
				})
		})
		.catch(e => {
			return new Response(JSON.stringify({
				error: e.json(),
				message: "Error while uploading image to supabase"
			}), {
				status: 500,
			})
		})
}

export default UploadThumbnail