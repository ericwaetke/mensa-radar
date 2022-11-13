import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"
import sharp from "sharp"

import vision from "@google-cloud/vision"
import { GoogleAuth, grpc } from "google-gax"
  
const apiKey = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCWmmcyDKSr/+V2\n10kK1hhWhmJV4C0TiMuuCd/+R9otCOhE6IARbXBXmNzwCKa0jtMHXNd6ddhKhll3\nnSJgcVXQArTX8Y/bFwZELbGG704hvPzZDVK4tB4WU+xwBKf/Ds+B8A2bxrnoxSS+\n+dsssUkQ5dmSCYprjU7Nyo8vAwszqwC6kjPBUea47S015zUAGFqx8ehdWEmSsXLz\nO1T/ajFk3bK3GRzSC5YfT1a1PkSwalnSNzGbxSxDyIDnQLUezfiuV7VZlJaRslW9\ndibnQ3Lx5RABRhTnvZkSCnYRhrOquPkehqJhzEJO/4ADd86OSkpFyp4DhfhkrTcW\nmWovs6d7AgMBAAECggEACzdqsiaQ6SKA4437KaxyWZdeoYi1srvAd7DSluyhCjOc\noO00BJhDArMm2VW7nLz6aJT4k21Nc5d3+Fmios4uFvTspRyfmzCmzdMdYrBWAFtD\n9aJxY8I+b2lGtb0TCgL/X20ShmSRmg18xCB1u2lkyLZlsuO1BHecw+TvLxAp+GoJ\nrSGAW1s34rwco9ajsDj3Odbz7eVu2FndPdEG/uteH2RiSxToHHiK9j9aMivt/fzH\n4YO6Lw4CWzSEaXd976zErWQCpx96kTuq1JknFtHUFRny8pIxbc1Oqn6hyCBG20NU\ny6o2PI1hj9izQd3RiWkl2brNwI+D2v2GxTNpB+ahyQKBgQDSi/DHVLUkMp9627ba\nVWqVOxjnPx/+Wki8I6q12kNpNRckKmfqRUlENG74NNLyuOWQjVhawLoOM2+LrxQ9\njkM1p9cMGQHC6OBJTU5AagYyJTKiqboLlofip4QKIMGw5VIpgOFfBmgd8EBAEftW\nm0zvBWD75uKEQQFVJR4C07B8zQKBgQC3HaDEwS5lYQNOLcAjwrfezpWRaUEeY26O\npvSz6tzGd+r48VR1dDs+NTtKizeLjzYEDEyhG4tv0ciJEmp+AcsY7WVwLnjUJYe5\n3uACmlo1ryq9qlr/TMP67IdZ6TbFo/tyQhILxjInI082/1QdW+cazJKR8E5BgBCz\nYi8UUUc1ZwKBgQDEMHowg5I3JKTOyqVcVXN3kxXlhUC+tkpIZcPQqI1gH4RswscJ\n2X4n++PbjP10By6Cv/Kwvh2g1fT+6CmoIkQmXztXnoWxpWY5Z7ue8izL1TWVtSoT\nWjVM0mOLPHK/7y/cVKes8D9chl6YVSkqzpOlthFlKQOx0RD40hlg8PjnkQKBgC36\nA27DbmnH9POBKzgPYOlRh15ORipiHtU0eEZgVvSCEX5V4bXn7CQPa4ao89ZXq+FS\nUT82UklOLAK2nARtYNguawTCtlXV4oE5w5cDuFi4VYvvpQ9q794l20oo8zammLC0\nhCFurxMCm5Ycf7srYxhoevinlI5/oDHaGiYIzk9LAoGAMbwAJdHuoMZz8XcbZMhn\nBmHNIOmrLqMMeNLX2JXF6ltvtZv+rcf//YfDv33qhz087MogiGT5AJcpmXkvIG9t\n7/B+9YZmY3E/ugkICy4MEKClZhivxrW3ktWJG40uPA0OB9Nifi4kikvrG0/26y46\nw2AjVBRDdUnQkTN1/AopLCM=\n-----END PRIVATE KEY-----\n'

const getApiCredentials = () => {
	const sslCreds = grpc.credentials.createSsl();
  const googleAuth = new GoogleAuth();
  const authClient = googleAuth.fromAPIKey(apiKey);
  const credentials = grpc.credentials.combineChannelCredentials(
	sslCreds,
	grpc.credentials.createFromGoogleCredential(authClient)
  );
  return credentials;
}
const getJSONCredentials = () => {
	return {
		type: "service_account",
		project_id: "mensa-radar",
		private_key_id: "34a8a2cda25dbe5772dd6b3430182711436bc045",
		private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCWmmcyDKSr/+V2\n10kK1hhWhmJV4C0TiMuuCd/+R9otCOhE6IARbXBXmNzwCKa0jtMHXNd6ddhKhll3\nnSJgcVXQArTX8Y/bFwZELbGG704hvPzZDVK4tB4WU+xwBKf/Ds+B8A2bxrnoxSS+\n+dsssUkQ5dmSCYprjU7Nyo8vAwszqwC6kjPBUea47S015zUAGFqx8ehdWEmSsXLz\nO1T/ajFk3bK3GRzSC5YfT1a1PkSwalnSNzGbxSxDyIDnQLUezfiuV7VZlJaRslW9\ndibnQ3Lx5RABRhTnvZkSCnYRhrOquPkehqJhzEJO/4ADd86OSkpFyp4DhfhkrTcW\nmWovs6d7AgMBAAECggEACzdqsiaQ6SKA4437KaxyWZdeoYi1srvAd7DSluyhCjOc\noO00BJhDArMm2VW7nLz6aJT4k21Nc5d3+Fmios4uFvTspRyfmzCmzdMdYrBWAFtD\n9aJxY8I+b2lGtb0TCgL/X20ShmSRmg18xCB1u2lkyLZlsuO1BHecw+TvLxAp+GoJ\nrSGAW1s34rwco9ajsDj3Odbz7eVu2FndPdEG/uteH2RiSxToHHiK9j9aMivt/fzH\n4YO6Lw4CWzSEaXd976zErWQCpx96kTuq1JknFtHUFRny8pIxbc1Oqn6hyCBG20NU\ny6o2PI1hj9izQd3RiWkl2brNwI+D2v2GxTNpB+ahyQKBgQDSi/DHVLUkMp9627ba\nVWqVOxjnPx/+Wki8I6q12kNpNRckKmfqRUlENG74NNLyuOWQjVhawLoOM2+LrxQ9\njkM1p9cMGQHC6OBJTU5AagYyJTKiqboLlofip4QKIMGw5VIpgOFfBmgd8EBAEftW\nm0zvBWD75uKEQQFVJR4C07B8zQKBgQC3HaDEwS5lYQNOLcAjwrfezpWRaUEeY26O\npvSz6tzGd+r48VR1dDs+NTtKizeLjzYEDEyhG4tv0ciJEmp+AcsY7WVwLnjUJYe5\n3uACmlo1ryq9qlr/TMP67IdZ6TbFo/tyQhILxjInI082/1QdW+cazJKR8E5BgBCz\nYi8UUUc1ZwKBgQDEMHowg5I3JKTOyqVcVXN3kxXlhUC+tkpIZcPQqI1gH4RswscJ\n2X4n++PbjP10By6Cv/Kwvh2g1fT+6CmoIkQmXztXnoWxpWY5Z7ue8izL1TWVtSoT\nWjVM0mOLPHK/7y/cVKes8D9chl6YVSkqzpOlthFlKQOx0RD40hlg8PjnkQKBgC36\nA27DbmnH9POBKzgPYOlRh15ORipiHtU0eEZgVvSCEX5V4bXn7CQPa4ao89ZXq+FS\nUT82UklOLAK2nARtYNguawTCtlXV4oE5w5cDuFi4VYvvpQ9q794l20oo8zammLC0\nhCFurxMCm5Ycf7srYxhoevinlI5/oDHaGiYIzk9LAoGAMbwAJdHuoMZz8XcbZMhn\nBmHNIOmrLqMMeNLX2JXF6ltvtZv+rcf//YfDv33qhz087MogiGT5AJcpmXkvIG9t\n7/B+9YZmY3E/ugkICy4MEKClZhivxrW3ktWJG40uPA0OB9Nifi4kikvrG0/26y46\nw2AjVBRDdUnQkTN1/AopLCM=\n-----END PRIVATE KEY-----\n",
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