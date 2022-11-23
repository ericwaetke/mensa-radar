import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"
import sharp from "sharp"

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const {
		query: { w, h, f, b, q, token },
	} = req
 
	if (f && b) {
		
	const url = `${ process.env.NEXT_PUBLIC_SUPABASE_URL }/storage/v1/object/public/${ b }/${ f }?token=${ token }`
	const buffer = (await axios({ url, responseType: "arraybuffer" })).data as Buffer
 
	// here we create a new_params object to convert string to number, and also set default value
	 const new_params  = {
	   w: + w || 800,  // set default 800px
	   h: + h || null,    // set to null if not provided, so that Sharp automatically keep the aspect ratio
	   q: + q || 80      // set default 80% quality
	 }
 
	 // here's where the Transformation happens
	sharp(buffer)
	 	.rotate()
		.resize({
				width: new_params.w,
				height: new_params.h,
				fit: sharp.fit.cover,
		})
	//    .resize(new_params.w, new_params.h)
		.webp({quality: new_params.q})     // change to .webp() if you want to serve as webp
		.withMetadata()
		.toBuffer()
		.then((data) => {
		 // here's where set the cache
		 // I set to cache the media for 1 week, 60seconds * 60minutes * 24hours * 7days
		 // remove setHeader('Cache-Control') if you wish not to cache it
			res.statusCode = 200
			res.setHeader("Cache-Control", `public, immutable, no-transform, s-maxage=604800, max-age=604800`)  
			res.setHeader("Content-Type", "image/webp")
			res.end(data)
		})
 
   } else {
	 res.statusCode = 500
	 res.setHeader("Content-Type", "text/html")
	 res.end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>")
   }
 }
 