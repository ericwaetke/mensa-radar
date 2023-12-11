/// <reference types="solid-start/env" />

type MensaData = {
	created_at: string
	daysWithFood: string[]
	id: number
	loc_lat: string
	loc_long: string
	mensa: number
	name: string
	open: true | false | null
	current_mensa_data: {
		openingTimes: MensaOpeningTimeObject
		enabled: boolean
	}[]
	url: string
}

type NewMensaData = {
	name: string
	url: string
	locLat: string
	locLong: string
	currentMensaData: {
		enabled: boolean
		openingTimes: MensaOpeningTimeObject
	}
}

type MensaOpeningTimeObject = {
	mo?: MensaOpeningTime
	tu?: MensaOpeningTime
	we?: MensaOpeningTime
	th?: MensaOpeningTime
	fr?: MensaOpeningTime
	sa?: MensaOpeningTime
	su?: MensaOpeningTime
}

type MensaOpeningTime = {
	from: number
	to: number
}

type MensaOpenObject = {
	open: boolean
	text: string
}

type FoodOffering = {
	id?: number
	mensa: number
	food_title: string
	food_desc: string
	vegan: boolean
	vegetarian: boolean
	fish: boolean
	meat: boolean
	nutrients: {
		name: string
		value: string
		unit: string
	}[]
	allergens: string[]
	date: string
	price_students: number
	price_other: number
	sold_out: boolean

	food_images?: { image_url: string }[] | null
	ratings?:
	| {
		rating: number
		userSessionId: string
	}[]
	| null

	has_ai_thumbnail?: boolean | null
	ai_thumbnail_url?: string | null
}

type NewFoodOffer = {
	allergens: string[]
	fish: boolean
	foodTitle: string
	foodTitleEn: string
	id: number
	meat: boolean
	nutrients: {
		name: string
		unit: string
		value: number
	}[]
	priceStudents: number
	priceOther: number
	qualityReviews: {
		rating: number
		userSessionId: string
	}[]
	soldOut: boolean
	vegan: boolean
	vegetarian: boolean
	hasAiThumbnail: boolean
	blurhash: string
	foodImages: { imageName: string; imageUrl: string }[]
}

type RedirectPromt = {
	today:
	| "montag"
	| "dienstag"
	| "mittwoch"
	| "donnerstag"
	| "freitag"
	| "samstag"
	| "sonntag"
	tomorrow:
	| "montag"
	| "dienstag"
	| "mittwoch"
	| "donnerstag"
	| "freitag"
	| "samstag"
	| "sonntag"
	recommendedRedirect:
	| "montag"
	| "dienstag"
	| "mittwoch"
	| "donnerstag"
	| "freitag"
	| "samstag"
	| "sonntag"
	shouldRedirectToTomorrow: boolean
}

type PlausibleEvents = {
	"Start Image Upload": never
	"Upload Image": never
}

type MensaList = {
	id: number
	name: string
	url: string
	open: boolean
	openingString: string
}[]

type EnhancedMensaList = {
	id: number
	nextFood: Date
	name: string
	url: string
	enabled: boolean
	openingTimes: MensaOpeningTimeObject
	locLat: string
	locLong: string
}