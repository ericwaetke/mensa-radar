import vision from "@google-cloud/vision"
import { env } from "../../../env.mjs"
import { NextRequest } from "next/server.js"
import { NextApiRequest, NextApiResponse } from "next"

const getJSONCredentials = () => {
	return {
		type: "service_account",
		project_id: "mensa-radar",
		private_key_id: env.CLOUD_VISION_KEY_ID,
		private_key: env.CLOUD_VISION_KEY.split(String.raw`\n`).join('\n'),
		client_email: "mensavision@mensa-radar.iam.gserviceaccount.com",
		client_id: "108153560610031743269",
		auth_uri: "https://accounts.google.com/o/oauth2/auth",
		token_uri: "https://oauth2.googleapis.com/token",
		auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
		client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/mensavision%40mensa-radar.iam.gserviceaccount.com"
	}
}

const labelImage = async (req: NextApiRequest, res: NextApiResponse) => {
	console.log(getJSONCredentials())
	let body;
	try {
		body = JSON.parse(req.body)
	} catch (e) {
		return new Response("Invalid JSON", { status: 400 })
	}

	// Creates a client
	const visionClient = new vision.ImageAnnotatorClient({
		credentials: getJSONCredentials(),
	});

	const url = body.imageUrl
	// const buffer = (await axios({ url, responseType: "arraybuffer" })).data as Buffer
	const fetchedImg = await fetch(url)
	const buffer = Buffer.from(await fetchedImg.arrayBuffer())

	// Performs label detection on the image file
	return visionClient
		.labelDetection(buffer)
		.then(results => {
			const labels = results[0].labelAnnotations;

			// Check if labels contains label.description === 'Food'
			if (labels.some(label => label.description === 'Food')) {
				console.log('Food detected');
				res.status(200).json({ isFood: true })
				return
				// return new Response(JSON.stringify({ isFood: true }), { status: 200 })
			} else {
				console.log("No food detected, found: ", JSON.stringify(labels))
				res.status(200).json({ isFood: false })
				return
				// return new Response(JSON.stringify({ isFood: false }), { status: 200 })
			}
		})
		.catch(err => {
			console.error('ERROR:', err);
			res.status(500).json({ error: err })
			// return new Response(JSON.stringify({ error: err }), { status: 500 })
		});
}
export default labelImage