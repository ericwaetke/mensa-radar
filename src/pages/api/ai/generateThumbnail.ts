export default async function handler(req, res) {
	try {
		await fetch(`https://ai.ericwaetke.de/prompt`, {
			method: "POST",
			body: JSON.stringify(req.body),
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json",
			},
		})
			.then(async (response) => {
				console.log(response.status, await response.text())
				return res.status(response.status);
			})
			.catch((error) => {
				console.error(error);
				return res.status(500).json({ error });
			});
	} catch (error) {
		console.error(error);
	}
}