import { useRouter } from 'next/router'
import Link from 'next/link'
var parseString = require("xml2js").parseString;
import 'tailwindcss/tailwind.css'

export default function Mensa(props) {
	const router = useRouter()
  	const { mensa } = router.query

    return (
        <div className="container mx-auto space-y-6">

			<Link href="/">
				<a className="p-6 my-3 inline-flex flex-row items-center rounded-xl border border-gray-200 hover:border-blue-400">
					<svg xmlns="http://www.w3.org/2000/svg" className="flex-initial" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
						<line x1="5" y1="12" x2="19" y2="12" />
						<line x1="5" y1="12" x2="11" y2="18" />
						<line x1="5" y1="12" x2="11" y2="6" />
					</svg>
					<h1 className="font-bold text-xl flex-initial">Guckst du Essen</h1>
				</a>
			</Link>

			<h2 className="font-display text-5xl capitalize">{mensa}</h2>

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

    // const router = useRouter()
    // const {mensa} = router.query

    console.log(context.query.mensa)

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
	

	console.log("getting food data")
	const response = await fetch(url)
	const xml = await response.text()
	
	
	// 0 = Heute
	let dateRef = 0;

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
				console.log(ref)
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

		foodOffers = angebote
	});

	return {
	  props: {
		foodOffers
	  }
	}
}