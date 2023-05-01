import { parseString } from "xml2js";
import { allergyChecker } from "./allergyChecker";
import foodTypeChecker from "./foodTypeChecker";
import { getSTWUrl } from "./getSTWUrl";
import { getWeekNumber } from "./getWeekNumber";

export const getAllMensaDataFromSTW = async (mensa) => {
	const response = await fetch(getSTWUrl(mensa))
	const xml = await response.text()

	let foodOffers = [];

	await parseString(xml, async function (err, result) {
		if (err || !result) console.error(`Error getting mensa Data of ${mensa}`)
		if(result.hasOwnProperty('p')){
			console.log('Database is temporary not responding')
		}
		if(result.menu.datum.length == 0){
			console.log("Fatal error in FH XML database")
		}

		result.menu.datum.forEach((day, index) => {
			// Checks if the dataset for today is empty
			if(day.angebotnr === 'undefined' || day.angebotnr == undefined) {
				
			} else {
				// Fetches the food offers for the selected day
				var angebote = [];
				if(day.angebotnr?.length !== 0 && day.angebotnr !== undefined) {
					for (let i = 0; i < day.angebotnr.length; i++){
						var ref = day.angebotnr[i];
				
						if(ref.labels[0].length == 0) {		
							let emptyLabel = { label : { 0 : 'empty'}}
				
							ref.labels[0] = emptyLabel;
						}	
				
						// Angebot vorhanden
						if(ref.preis_s[0] !== '' && ref.beschreibung[0] !== "" && ref.beschreibung[0] !== ".") {
							let titel = ref.titel[0]
							let beschreibung
				
							// if(ref.beschreibung == '.') {
							// 	beschreibung = "Angebot nicht mehr verfügbar"
							// } else {
							// }
							beschreibung = ref.beschreibung[0]

							// Setting Nutrient Array
							let nutrients = ref.nutrients[0].nutrient ? ref.nutrients[0].nutrient : []

							let allergene = ref["additives-allergens"][0].string[0].split(", ")
							// Replace all allergene symbols with the Description from the allergyChecker helper
							allergene = allergene.map(allergen => allergyChecker(allergen))
							
							// Check if Array is filled to calculate kcal
							if(nutrients.length !== 0) {
								// nutrients.splice(1, 0,  {name: ["Energiewert (Kcal)"], wert: [kcal], einheit: ["kcal"]})
								// nutrients[0].wert[0] = `${tempEnergy} / ${kcal}`

								for (let i = 0; i < nutrients.length; i++) {
									const tempNutrient = nutrients[i];
									nutrients[i] = {
										name: tempNutrient.name[0],
										value: tempNutrient.wert[0],
										unit: tempNutrient.einheit[0]
									}
								}
							}

							angebote.push({
								beschreibung,
								labels: foodTypeChecker(ref.labels[0].label[0].$?.name),
								preise: {
									preis_s: ref.preis_s,
									preis_m: ref.preis_m,
									preis_g: ref.preis_g
								},
								nutrients,
								allergene,
								week: getWeekNumber(new Date()),
								date: day["$"].index
							})
						} else {
							// Dont Push Angebnot into array
						}
					}
				}
			}
			if (angebote && angebote?.length !== 0) {
				foodOffers = [...foodOffers, ...angebote]
			}
		})
		
	});

	return foodOffers;
}