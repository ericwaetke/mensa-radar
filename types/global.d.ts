type MensaData = {
	created_at: string,
	daysWithFood: string[],
	id: number,
	loc_lat: string,
	loc_long: string,
	mensa: number,
	name: string,
	open: true | false | null,
	current_mensa_data: {
		openingTimes: MensaOpeningTime[]
	}[],
	url: string,
}

type MensaOpeningTime = {
	from: number,
	to: number,
}

type MensaOpenObject = {
	open: boolean,
	text: string,
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

type RedirectPromt = {
	today: "montag" | "dienstag" | "mittwoch" | "donnerstag" | "freitag" | "samstag" | "sonntag",
	tomorrow: "montag" | "dienstag" | "mittwoch" | "donnerstag" | "freitag" | "samstag" | "sonntag",
	recommendedRedirect: "montag" | "dienstag" | "mittwoch" | "donnerstag" | "freitag" | "samstag" | "sonntag",
	shouldRedirectToTomorrow: boolean,
}

type PlausibleEvents = {
	"Start Image Upload": never,
	"Upload Image": never,
}