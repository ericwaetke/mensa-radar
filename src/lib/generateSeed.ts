export function generateSeed(seedLength: number = 16) {
	let seedArray = [];

	for (let i = 0; i < seedLength; i++) {
		seedArray.push(Math.floor(Math.random() * 10))
	}
	return seedArray.reduce((accum, digit) => (accum * 10) + digit, 0);
}
