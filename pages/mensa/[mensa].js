import { useRouter } from 'next/router'
var parseString = require("xml2js").parseString;

export default function Mensa(props) {
    console.log(props)
    return (
        <div>
            {props.foodOffers.map(offer => {
				return <p key={offer.angebot}>{offer.angebot} - {offer.beschreibung}</p>
			})}
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
			var dataIsValid = ref.preis_s[0] !== '';
	
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
					// labels: foodTypeChecker(ref.labels[0].label[0].$.name)
					labels: foodTypeChecker(ref.labels[0].label[0].$?.name)
				}
			} else {
				angebote[i] = { angebot:'', beschreibung:'', labels: ''}
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