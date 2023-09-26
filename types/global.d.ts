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
		openingTimes: MensaOpeningTimeObject,
		enabled: boolean,
	}[],
	url: string,
}

type MensaOpeningTimeObject = {
	mo: MensaOpeningTime,
	tu: MensaOpeningTime,
	we: MensaOpeningTime,
	th: MensaOpeningTime,
	fr: MensaOpeningTime,
	sa: MensaOpeningTime,
	su: MensaOpeningTime,
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
	id?: number,
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

	food_images?: { image_url: string }[] | null,
	ratings?: {
		rating: number,
		userSessionId: string,
	}[] | null,

	has_ai_thumbnail?: boolean | null,
	ai_thumbnail_url?: string | null,
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

type MensaList = {
	id: number,
	name: string,
	url: string,
	open: boolean,
	openingString: string,
}[]

// SWP Parser
type WebspeiseplanGericht = {
	speiseplanAdvancedGericht: {
		id: number,
		aktiv: boolean,
		// "2023-09-25T00:00:00+02:00"
		datum: string,
		gerichtkategorieID: number,
		reihenfolgeGerichtkategorie: number,
		gerichtname: string,
		zusatzinformationenID: number,
		speiseplanAdvancedID: number,
		// "2023-09-23T18:05:01"
		timestampLog: string,
		benutzerID: number,
	},
	zusatzinformationen: {
		id: number,
		gerichtnameAlternative: string,
		mitarbeiterpreisDecimal2: number,
		gaestepreisDecimal2: number,
		ernaehrungsampelID: unknown,
		nwkjInteger: number,
		nwkcalInteger: number,
		nwfettDecimal1: number,
		nwfettsaeurenDecimal1: number,
		nekohlenhydrateDecimal1: number,
		nwzuckerDecimal1: number,
		nweiweissDecimal1: number,
		nwsalzDecimal1: number,
		nwbeDecimal2: unknown,
		allowFeedback: boolean,
		gerichtImage: unknown,
		lieferanteninfo: unknown,
		edFaktorDecimal1: unknown,
		// 355101
		plu: string,
		price3Decimal2: number,
		price4Decimal2: number,
		contingent: unknown,
		taxRateDecimal2: unknown,
		ingredientList: unknown,
		sustainability: {
			co2: unknown,
			nutriscore: unknown,
			trafficLight: unknown,
		}
	},
	// "81,75"
	allergeneIds: string | number[],
	zusatzstoffeIds: string,
	// "36,37"
	gerichtsmerkmaleIds: string | number[],
}

type WebspeiseplanResponse = {
	success: boolean,
	content: { // Weeks
		speiseplanAdvanced: {
			id: number,
			aktiv: boolean,
			gueltigTaeglich: boolean,
			showWeekend: boolean,
			exportInactiveContent: boolean | null,
			// Mittagessen
			titel: string,
			// Mittagessen
			anzeigename: string,
			gueltigVon: string,
			gueltigBis: string,
			// 1
			reigenfolgeInApp: number,
			speiseplanLayoutTypeID: unknown | null,
			vendingMachineID: unknown | null,
			orderConfigurationID: unknown | null,
			pickupTimeID: unknown | null,
			// 7
			outletID: number,
			timestampLog: string,
			benutzerID: number,
			orderInfo: {
				orderAllowed: boolean,
				preOrderAllowed: boolean,
				instantOrderAllowed: boolean,
				shippingAllowed: boolean,
				deliveryAssortment: boolean,
				instantOrderMinimumOrderValue: unknown | null,
				preOrderMinimumOrderValue: unknown | null,
				shippingOrderMinimumOrderValue: unknown | null,
				shippingCostFlatrate: unknown | null,
				shippingCostThreshold: unknown | null,
				postalCodeVerification: boolean,
				reusableProvider: boolean,
				reusableProviderId: unknown | null,
				allowedOrderProcesses: unknown[],
				scan2go: boolean,
			},
			locationInfo: {
				id: number,
				name: string,
			}
			holidayInfo: unknown[],
			pickupTimeInfo: unknown[],
		},
		speiseplanGerichtData: WebspeiseplanGericht[]
	}[]
}

enum WebspeiseplanGerichtsmerkmale {
	Schwein = 48,
	Wild = 49,
	Regional = 50,
	Vegetarisch = 36,
	Vegan = 37,
	Geflügel = 38,
	Alkohol = 39,
	Rind = 40,
	Fisch = 46,
	Lamm = 47
}


// Zusatzstoffe
enum Zusatzstoffe {
	Phenylalaninquelle = 64,
	Knoblauch_Baerlauch = 65,
	KeinZusatzstoff = 66,
	Geschwaerzt = 45,
	MitFarbstoff = 46,
	MitAntioxidationsmittel = 47,
	MitGeschmacksverstaerker = 48,
	MitPhosphat = 49,
	MitKonservierungsstoff = 50,
	MitSuessungsmittel = 51,
	MitSuessungsmitteln = 52,
	Geschwefelt = 60,
	Gewachst = 61,
	Chininhaltig = 62,
	Koffeinhaltig = 63
}

// ALLERGENE

enum Allergene {
	Milch = 71,
	Eier = 72,
	Sesam = 73,
	Senf = 74,
	GlutenAusWeizen = 75,
	Mandeln = 76,
	Haselnuesse = 77,
	Walnuesse = 78,
	Soja = 79,
	SchwefeldioxidUndSulfite = 80,
	Sellerie = 81,
	GlutenAusRoggen = 82,
	CashewNuesse = 83,
	GlutenAusGerste = 84,
	Krebstiere = 98,
	Fisch = 99,
	Erdnuesse = 100,
	Lupinen = 101,
	Weichtiere = 102,
	GlutenAusDinkel = 103,
	GlutenAusKamut = 104,
	GlutenAusHafer = 105,
	Pecannuesse = 106,
	Paranuesse = 107,
	Pistazien = 108,
	Macadamianuesse = 109,
	KeinAllergen = 110
}
