import { useState } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
var parseString = require("xml2js").parseString;
import 'tailwindcss/tailwind.css'
import Footer from '../../components/footer';
// import "../../assets/css/mensa.module.css"

export default function Mensa(props) {
	const router = useRouter()
  	const { mensa } = router.query

	// Switcher for Nutiotional Intformation is not yet working
	const [offers, setOffers] = useState([])
	
	const collapseNutrionionInfo = (index) => {
		let tempOffers = [...offers]
		let tempOffer = tempOffers[index]
		tempOffer = !tempOffer
		tempOffers[index] = tempOffer
		
		setOffers(tempOffers)
	}

    return (
        <div className="space-y-6 break-words max-w-screen-2xl 2xl:mx-auto">
			<style jsx>
				{`
					.daySelection{
						position: relative;
					}
					.daySelection::before{
						content: "";
						position: absolute;
						right: 0;
						width: 20%;
						height: 100%;
						background: linear-gradient(270deg, white, transparent);
						pointer-events: none;
					}
					.open {
						transition: .3s;
						transform: rotate(180deg)
					}
					.closed {
						transition: .3s;
						transform: rotate(0);
					}
					.ReactCollapse--collapse {
						transition: height 500ms;
						}
				`}
			</style>
			<Link href="/">
				<a className="p-6 my-3 mx-9 inline-flex flex-row items-center rounded-xl border border-gray-200 hover:border-blue-400 hover:text-blue-400">
					<h1 className="font-bold text-xl flex-initial">&larr; Guckst du Essen</h1>
				</a>
			</Link>

			<h2 className="font-display text-5xl capitalize mx-9 px-8">{mensa}</h2>

			{/* Day Selection */}
			<div className="daySelection">
				<div className="px-9 space-x-4 flex overflow-x-scroll overflow-y-hidden">
					{
						props.days.map((day, i) => {
							let isSelected = props.selectedWeekday - (5 - props.days.length) === i
							return <button href={`/${mensa}/${day.url}`} onClick={() => {router.push(`/${mensa}/${day.url}`)}}><a className={`px-8 py-4 my-3 inline-flex min-w-max flex-col items-start rounded-xl border-2 border-green bg-green hover:bg-green-border hover:border-green-border hover:text-white ${isSelected ? "border-green-border border-2" : ""}`}><p className="font-bold">{day.mainText}</p><p>{day.subText}</p></a></button> //TODO: Current Day Border does not work yet
						})
					}
				</div>
			</div>

			<div className="mx-9 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 2xl:grid-cols-3">
            {props.foodOffers.map((offer, i) => {
				return (
					<div className="flex-initial rounded-xl border border-gray-200">
						<div className="p-8 pb-4">
							<p className="font-medium text-sm text-gray-400">{offer.titel}</p>
							<p className="text-2xl font-medium">{offer.beschreibung}</p>
							<div className="mt-9 flex justify-between flex-col xs:flex-row items-start gap-y-2">
								<p className="font-bold text-gray-400 text-sm"><span className="bg-green rounded-full py-1 px-4 text-black inline-block">{offer.preise.preis_s} €</span> {offer.preise.preis_g} €</p>
								{offer.labels.filter !== "all" && <p className="capitalize font-bold text-sm bg-green rounded-full py-1 px-4 inline-block">{offer.labels.filter}</p>}
							</div>
						</div>
						<div className="">
							<button className="px-8 py-4 border-t w-full flex items-center gap-2" onClick={() => collapseNutrionionInfo(i)}>
								<svg width="6" height="6" fill="none" xmlns="http://www.w3.org/2000/svg" className={offers[i] ? "open" : "closed"}>
									<path d="M3.83 4.74a1 1 0 0 1-1.66 0L.56 2.3A1 1 0 0 1 1.39.75h3.22a1 1 0 0 1 .83 1.55l-1.6 2.44Z" fill="#000"/>
								</svg>
								<p className="font-medium">Nährwerte</p>
							</button>
							{offers[i] && (
								<div className="px-8 pb-4">
									{offer.nutrients?.map(nutrient => {
										return <p>{nutrient}</p>
									})}
								</div>
							)}
						</div>
					</div>
				)
			})}
			</div>
			<Footer />
        </div>
    )
}

export async function getServerSideProps(context) {


	let selectedWeekday = 0;
	switch (context.query.day) {
		case "montag":
			selectedWeekday = 0
			break;
		case "dienstag":
			selectedWeekday = 1
			break;
		case "mittwoch":
			selectedWeekday = 2
			break;
		case "donnerstag":
			selectedWeekday = 3
			break;
		case "freitag":
			selectedWeekday = 4
			break;
		default:
			break;
	}

	console.log(context.query.mensa, context.query.day, selectedWeekday)

	const currentDate = new Date()
	let currentWeekday = currentDate.getDay() // if Weekday between 1 and 5 its in the weekday
	currentWeekday = currentWeekday === 0 ? 6 : currentWeekday - 1
	const isWeekday = currentWeekday < 5;
	let days = [
		{
			mainText: "Mo",
			subText: "",
			url: "montag",
		},
		{
			mainText: "Di",
			subText: "",
			url: "dienstag",
		},
		{
			mainText: "Mi",
			subText: "",
			url: "mittwoch",
		},
		{
			mainText: "Do",
			subText: "",
			url: "donnerstag",
		},
		{
			mainText: "Fr",
			subText: "",
			url: "freitag",
		},
	]

	// Get Dates
	for (let i = 0; i < 5; i++) {
		let tempDate = new Date(currentDate)
		if(i === currentWeekday){
			days[i].subText = `${days[i].mainText}, ${tempDate.getDate()}. ${new Intl.DateTimeFormat('de-DE', {month: 'short'}).format(tempDate)}`
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

    switch (context.query.mensa) {
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
		console.log(day)
	
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
	});

	return {
	  props: {
		foodOffers,
		selectedWeekday,
		days
	  }
	}
}