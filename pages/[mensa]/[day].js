import { useRouter } from 'next/router'
import Link from 'next/link'
var parseString = require("xml2js").parseString;
import 'tailwindcss/tailwind.css'

export default function Mensa(props) {
	const router = useRouter()
  	const { mensa } = router.query

	console.log(props)	


    return (
        <div className="container mx-auto space-y-6">

			<Link href="/">
				<a className="p-6 my-3 inline-flex flex-row items-center rounded-xl border border-gray-200 hover:border-blue-400 hover:text-blue-400">
					<h1 className="font-bold text-xl flex-initial">&larr; Guckst du Essen</h1>
				</a>
			</Link>

			<h2 className="font-display text-5xl capitalize">{mensa}</h2>

			{/* Day Selection */}
			<div className="space-x-4">
				{
					props.days.map((day, i) => {
						return <Link href={`/${mensa}/${day.url}`}><a className={`px-6 py-4 my-3 inline-flex flex-col items-start rounded-xl border-2 border-green bg-green hover:bg-green-border hover:border-green-border hover:text-white ${i == props.selectedWeekday ? "border-green-border border-2" : ""}`}><p className="font-bold">{day.mainText}</p>{day.subText}</a></Link>
					})
				}
			</div>

            {props.foodOffers.map(offer => {
				console.log(offer)
				return <div className="flex-initial rounded-xl border border-gray-200 p-8">
					<p className="uppercase font-semibold text-sm text-gray-500">{offer.titel}</p>
					<p className="text-2xl font-medium">{offer.beschreibung}</p>
					<div className="mt-9 flex justify-between">
						<p><span className="font-black">{offer.preise.preis_s} €</span> | {offer.preise.preis_g} €</p>
						<p className="capitalize font-bold">{offer.labels.filter}</p>
					</div>
				</div>
			})}
		<footer className="py-9">
			<p>Designed and Developed by <a href="https://ericwaetke.com" target="_blank" className="text-blue-400">Eric Wätke</a> + <a href="https://martinzerr.de" target="_blank" className="text-blue-400">Martin Zerr</a></p>
		</footer>
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
		case "samstag":
			selectedWeekday = 5
			break;
		case "sonntag":
			selectedWeekday = 6
			break;
		default:
			break;
	}

	// console.log(mensa, day, selectedWeekday)

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
		{
			mainText: "Sa",
			subText: "",
			url: "samstag",
		},
		{
			mainText: "So",
			subText: "",
			url: "sonntag",
		},
	]

	// Get Dates
	for (let i = 0; i < 7; i++) {
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
		VEGETARISCH: "vegetarisch",
		VEGAN: "vegan",
		PESCETARISCH: "pescetarisch",
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
	
	parseString(xml, function (err, result) {
		if(result.hasOwnProperty('p')){
			console.log('Database is temporary not responding')
		}
		if(result.menu.datum.length == 0){
			console.log("Fatal error in FH XML database")
		}
		const day = result.menu.datum[dateRef];
	
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
		
				if(ref.preis_s[0] !== '' || ref.beschreibung[0] !== "" || ref.beschreibung[0] !== ".") {
					let titel = ref.titel[0]
					let beschreibung
		
					if(ref.beschreibung == '.') {
						beschreibung = "Angebot nicht mehr verfügbar"
					} else {
						beschreibung = ref.beschreibung[0]
					}
					angebote[i] = {
						titel,
						beschreibung,
						labels: foodTypeChecker(ref.labels[0].label[0].$?.name),
						preise: {
							preis_s: ref.preis_s,
							preis_m: ref.preis_m,
							preis_g: ref.preis_g
						}
					}
				} else {
					angebote[i] = {angebot:'', beschreibung:'', labels: '', preise: {}}
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