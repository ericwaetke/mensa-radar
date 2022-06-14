import { parseString } from "xml2js";

export const getMensaData = async (selectedWeekday, mensa, days) => {

	// console.log(context.query.mensa, context.query.day, selectedWeekday)

	const currentDate = new Date()
	let currentWeekday = currentDate.getDay() // if Weekday between 1 and 5 its in the weekday
	currentWeekday = currentWeekday === 0 ? 6 : currentWeekday - 1
	const isWeekday = currentWeekday < 5;

	// Get Dates
	for (let i = 0; i < 5; i++) {
		let tempDate = new Date(currentDate)
		if(i === currentWeekday){
			days[i].subText = `${days[i].mainText}, ${tempDate.getDate()}.${tempDate.getMonth()}`
			// days[i].subText = `${days[i].mainText}, ${tempDate.getDate()}. ${new Intl.DateTimeFormat('de-DE', {month: 'short'}).format(tempDate)}`
			days[i].mainText = "Heute"
		} else {
			tempDate.setDate(currentDate.getDate() + (i - currentWeekday))
			days[i].subText = `${tempDate.getDate()}.`
		}
	}

	days = days.slice(currentWeekday)

    // const router = useRouter()
    // const {mensa} = router.query

    const urls = {
        golm: "https://xml.stw-potsdam.de/xmldata/go/xml.php",
        fhp: "https://xml.stw-potsdam.de/xmldata/ka/xml.php",
        neues_palais: "https://xml.stw-potsdam.de/xmldata/np/xml.php"
    }
    let url;

    switch (mensa) {
        case "golm":
            url = urls.golm
            break;
        case "fhp":
            url = urls.fhp
            break;
        case "neues-palais":
            url = urls.neues_palais
        default:
            url = urls.fhp
            break;
    }

	function foodTypeChecker(label){
	  const foodTypes = {
		SCHWEIN: "schweinefleisch",
		GEFLUEGEL: "gefluegel",
		LAMM: "lamm",
		RIND: "rindfleisch",
		FISCH: "fisch",
		VEGETARISCH: "vegetarisch",
		VEGAN: "vegan"
	  }
	
	  const filterTypes = {
		VEGETARISCH: "🥛 Vegetarisch",
		VEGAN: "🌱 Vegan",
		PESCETARISCH: "🐟 Pescetarisch",
		ALL: "all"
	  }
	
	  switch (label) {
		case foodTypes.SCHWEIN:
		  return {foodType: foodTypes.SCHWEIN, filter: filterTypes.ALL}
	
		case foodTypes.GEFLUEGEL:
		  return {foodType: foodTypes.GEFLUEGEL, filter: filterTypes.ALL}
	
		case foodTypes.LAMM:
		  return {foodType: foodTypes.LAMM, filter: filterTypes.ALL}
		  
		case foodTypes.RIND:
		  return {foodType: foodTypes.RIND, filter: filterTypes.ALL}
		  
		case foodTypes.FISCH:
		  return {foodType: foodTypes.FISCH, filter: filterTypes.PESCETARISCH}
		  
		case foodTypes.VEGETARISCH:
		  return {foodType: foodTypes.VEGETARISCH, filter: filterTypes.VEGETARISCH}
		  
		case foodTypes.VEGAN:
		  return {foodType: foodTypes.VEGAN, filter: filterTypes.VEGAN}
		  
		default:
		  return {foodType: "", filter: filterTypes.ALL};
	  }
	}
	
	const response = await fetch(url)
	const xml = await response.text()
	
	// 0 = Heute
	let dateRef = (selectedWeekday - currentWeekday) < 0 ? 0 : selectedWeekday - currentWeekday;

	let foodOffers;

	await parseString(xml, function (err, result) {
        if (err) {console.error(err)}
		console.log("parsing string")
		if(result.hasOwnProperty('p')){
			console.log('Database is temporary not responding')
		}
		if(result.menu.datum.length == 0){
			console.log("Fatal error in FH XML database")
		}

		// Day which the food is fetched for
		// This is seemingly not updated on Route Pushes
		let day = result.menu.datum[dateRef];
		// console.log(day)
	
		// Checks if the dataset for today is empty
		if(day.angebotnr === 'undefined' || day.angebotnr == undefined) {
			
		}
	
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
					
					// Check if Array is filled to calculate kcal
					if(nutrients.length !== 0) {
						let tempEnergy = nutrients[0].wert[0]
						let kcal = Math.round(nutrients[0].wert[0] * 0.2390057361)
						// nutrients.splice(1, 0,  {name: ["Energiewert (Kcal)"], wert: [kcal], einheit: ["kcal"]})
						// nutrients[0].wert[0] = `${tempEnergy} / ${kcal}`

						for (let i = 0; i < nutrients.length; i++) {
							const tempNutrient = nutrients[i];
							nutrients[i] = `${tempNutrient.name[0]}: ${tempNutrient.wert[0]} ${tempNutrient.einheit[0]}`
						}

						nutrients[0] = `Energie: ${tempEnergy} kJ / ${kcal} kcal`
					}

					angebote.push({
						titel,
						beschreibung,
						labels: foodTypeChecker(ref.labels[0].label[0].$?.name),
						preise: {
							preis_s: ref.preis_s,
							preis_m: ref.preis_m,
							preis_g: ref.preis_g
						},
						nutrients,
					})
				} else {
					// Dont Push Angebnot into array
				}
			}
		}

		foodOffers = angebote
        return foodOffers
	});
}