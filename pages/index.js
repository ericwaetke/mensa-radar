import Head from "next/head";
import Link from 'next/link'

let fetchedData;
var parseString = require("xml2js").parseString;

export default function Home(props) {
	console.log(props)
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Guckst du Essen</a>
        </h1>

        <div className="grid">
          <Link href="/mensa/golm">
            <a className="card"><h3>Golm &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p></a>
          </Link>

          <Link href="/mensa/neues-palais">
		  <a className="card"><h3>Neues Palais &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p></a>
          </Link>

          <Link href="/mensa/fhp">
		  <a className="card"><h3>FHP &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p></a>
          </Link>
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <img src="/vercel.svg" alt="Vercel" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps(context) {

	function foodTypeChecker(label){
		console.log(label);
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
	const response = await fetch("https://xml.stw-potsdam.de/xmldata/ka/xmlfhp.php")
	const xml = await response.text()
	
	console.log(response)
	
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
				console.log("No Label provided — adding empty one")
				
				let emptyLabel = { label : { 0 : 'empty'}}
	
				ref.labels[0] = emptyLabel;
			}
			console.log("LABELSCHECK", ref)
	
	
			if(ref.preis_s[0] !== '' || ref.beschreibung[0] !== "" || ref.beschreibung[0] !== ".") {
				let titel = ref.titel[0]
				let beschreibung
	
				if(ref.beschreibung == '.') {
					beschreibung = "Angebot nicht mehr verfügbar"
				} else {
					beschreibung = ref.beschreibung[0]
				}
	
				angebote[i] = {
					angebot: titel,
					beschreibung: beschreibung,
					// labels: foodTypeChecker(ref.labels[0].label[0].$.name)
					labels: foodTypeChecker(ref.labels[0].label[0].$?.name)
				}
			} else {
				angebote[i] = { angebot:'', beschreibung:'', labels: ''}
			}
		}
	
		console.log("Alle Angebote: ", angebote);
		foodOffers = angebote
	});

	return {
	  props: {
		foodOffers
	  }
	}
  }