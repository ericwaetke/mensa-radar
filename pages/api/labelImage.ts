import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"
import sharp from "sharp"

import vision from "@google-cloud/vision"
  
const getJSONCredentials = () => {
	return {
		type: "service_account",
		project_id: "mensa-radar",
		private_key_id: process.env.CLOUD_VISION_KEY_ID,
		private_key: process.env.CLOUD_VISION_KEY,
		client_email: "mensavision@mensa-radar.iam.gserviceaccount.com",
		client_id: "108153560610031743269",
		auth_uri: "https://accounts.google.com/o/oauth2/auth",
		token_uri: "https://oauth2.googleapis.com/token",
		auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
		client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/mensavision%40mensa-radar.iam.gserviceaccount.com"
	}    
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const {
		query: { f, b },
	} = req

	if(true) {
		//Get the image from the request body
		const url = `${ process.env.NEXT_PUBLIC_SUPABASE_URL }/storage/v1/object/public/${ b }/${ f }`
		console.log(url)
		// const url = `${ process.env.NEXT_PUBLIC_SUPABASE_URL }/storage/v1/object/public/${ b }/${ f }?token=${ token }`
		const buffer = (await axios({ url, responseType: "arraybuffer" })).data as Buffer

		// Creates a client
		const client = new vision.ImageAnnotatorClient({
			credentials: getJSONCredentials(),
		});

		// Performs label detection on the image file
		
		return client
		.labelDetection(buffer)
		.then(results => {
			const labels = results[0].labelAnnotations;

			// Check if labels contains label.description === 'Food'
			if (labels.some(label => label.description === 'Food')) {
				console.log('Food detected');
				res.status(200).json({
					isFood: true
				});
			} else {
				res.status(200).json({
					isFood: false
				});
			}
		})
		.catch(err => {
			console.error('ERROR:', err);
			res.status(500).json({
				error: err
			});
		});
	}
	else {
	   res.statusCode = 500
	   res.setHeader("Content-Type", "text/html")
	   res.end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>")
	 }
}