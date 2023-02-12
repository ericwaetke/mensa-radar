type MensaData = {
	created_at: string,
	daysWithFood: string[],
	id: number,
	loc_lat: string,
	loc_long: string,
	mensa: number,
	name: string,
	open: true | false | null,
	openingTimes: {open: boolean, text: string},
	url: string,
}

type FoodOffering = {
	id: number,
	mensa: number,
	food_title: string,
	food_desc: string,
	vegan: boolean,
	vegetarian: boolean,
	fish: boolean,
	meat: boolean,
	nutrients: {
		name: string,
		value: string,
		unit: string,
	}[],
	allergens: string[]
	date: string,
	price_students: number,
	price_other: number,
	sold_out: boolean,

	imageUrls: string[],
	ratings: {
		rating: number,
		userSessionId: string,
	}[]
	has_ai_thumbnail: boolean,
}