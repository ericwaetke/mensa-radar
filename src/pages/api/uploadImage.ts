import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"
import sharp from "sharp"
import { supabase } from "../../lib/getSupabaseClient"


export default async (req: NextApiRequest, res: NextApiResponse) => {
	// Get the image from the request body
	const file = req.body as File
	const fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

	supabase.storage
		.from("food-images")
		.upload(fileName, file as File)
		.then(data => {
			res.status(200).json({
				data
			})
		}).catch(err => {
			res.status(500).json({
				err
			})
		})
}