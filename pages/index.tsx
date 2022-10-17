import { useEffect, useState } from "react";

import Head from "next/head";
import Link from 'next/link';

import Footer from "../components/footer";
import { useOpeningString } from "../hooks/useOpeningString";
import { getOpeningString } from "../lib/getOpeningString";

export const mensaData = [
	{
		name: "Golm",
		url: "golm",
		coords: {
			latitude: 52.40795670687466, 
			longitude: 12.978685326538164
		},
		openingTimes: {
			0: { from: 11, to: 14.5 }, //mon
			1: { from: 11, to: 14.5 }, //di
			2: { from: 11, to: 14.5 }, //mi
			3: { from: 11, to: 14.5 }, //do
			4: { from: 11, to: 14.5 }, //fr
			5: { from: 11, to: 14.5 }, //sa für sonderfälle
			6: { from: 11, to: 14.5 }, //so für sonderfälle
		},
		openingString: "Loading Opening Times",
		opening: 11,
		closing: 14.5
	},
	{
		name: "Neues Palais",
		url: "neues-palais",
		coords: {
			latitude: 52.402868541881624, 
			longitude: 13.011995232289776
		},
		openingTimes: {
			0: { from: 11, to: 14.5 },
			1: { from: 11, to: 14.5 },
			2: { from: 11, to: 14.5 },
			3: { from: 11, to: 14.5 },
			4: { from: 11, to: 14.5 },
			5: { from: 11, to: 14.5 },
			6: { from: 11, to: 14.5 },
		},
		openingString: "Loading Opening Times",
		opening: 11,
		closing: 14.5
	},
	{
		name: "FHP",
		url: "fhp",
		coords: {
			latitude: 52.41324028310374, 
			longitude: 13.051182387706824 
		},
		openingTimes: {
			0: { from: 11, to: 14.5 },
			1: { from: 11, to: 14.5 },
			2: { from: 11, to: 14.5 },
			3: { from: 11, to: 14.5 },
			4: { from: 11, to: 14.5 },
			5: { from: 11, to: 14.5 },
			6: { from: 11, to: 14.5 },
		},
		openingString: "Loading Opening Times",
		opening: 11,
		closing: 14.5
	},
	{
		name: "Brandenburg an der Havel",
		url: "brandenburg",
		coords: {
			latitude: 52.41159566949572,
			longitude: 12.539779153390663
		},
		openingTimes: {
			0: { from: 11, to: 14 },
			1: { from: 11, to: 14 },
			2: { from: 11, to: 14 },
			3: { from: 11, to: 14 },
			4: { from: 11, to: 14 },
			5: { from: 11, to: 14 },
			6: { from: 11, to: 14 },
		},
		openingString: "Loading Opening Times",
		opening: 11,
		closing: 14
	},
	{
		name: "Filmuniversität",
		url: "filmuniversitaet",
		coords: {
			latitude: 52.38889031847045, 
			longitude: 13.116692300009127
		},
		openingTimes: {
			0: { from: 11, to: 14.5 },
			1: { from: 11, to: 14.5 },
			2: { from: 11, to: 14.5 },
			3: { from: 11, to: 14.5 },
			4: { from: 11, to: 14.5 },
			5: { from: 11, to: 14.5 },
			6: { from: 11, to: 14.5 },
		},
		openingString: "Loading Opening Times",
		opening: 11,
		closing: 14.5
	},
	{
		name: "Griebnitzsee",
		url: "griebnitzsee",
		coords: {
			latitude: 52.393549668399444, 
			longitude: 13.12775872728105
		},
		openingTimes: {
			0: { from: 11, to: 14.5 },
			1: { from: 11, to: 14.5 },
			2: { from: 11, to: 14.5 },
			3: { from: 11, to: 14.5 },
			4: { from: 11, to: 14.5 },
			5: { from: 11, to: 14.5 },
			6: { from: 11, to: 14.5 },
		},
		openingString: "Loading Opening Times",
		opening: 11,
		// TODO: Freitag nur bis 14 Uhr
		closing: 14.5
	},
	{
		name: "Wildau",
		url: "wildau",
		coords: {
			latitude: 52.31913645920946, 
			longitude: 13.632358896246892
		},
		openingTimes: {
			0: { from: 8, to: 15 },
			1: { from: 8, to: 15 },
			2: { from: 8, to: 15 },
			3: { from: 8, to: 15 },
			4: { from: 8, to: 15 },
			5: { from: 8, to: 15 },
			6: { from: 8, to: 15 },
		},
		openingString: "Loading Opening Times",
		opening: 8,
		closing: 15
	}
]

export default function Home(props) {
	const d = new Date();
	const currentTime = d.getHours() + d.getMinutes()/60
	const currentDay = d.getDay()

	const [mensen, setMensen] = useState([])
	const [locationPermission, setLocationPermission] = useState(false)

	const getLocation = () => {
		const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
			const earthRadius = 6371; // Radius of the earth in km
			const dLat = deg2rad(lat2-lat1);
			const dLon = deg2rad(lon2-lon1);
			var a = 
				Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
				Math.sin(dLon/2) * Math.sin(dLon/2)
				; 
			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	
			return earthRadius * c;
		}
		
		const deg2rad = (deg) => deg * (Math.PI/180)
		
		const success = (data) => {
			setLocationPermission(true)
			// User Coords
			const {latitude, longitude} = data.coords

			let tempMensen = []
			mensaData.map((mensa) => {
				const distance = getDistanceFromLatLonInKm(latitude, longitude, mensa.coords.latitude, mensa.coords.longitude)
				tempMensen.push({
					...mensa,
					distance: Math.round(distance * 10) / 10
				})
			})

			// Sorting Mensas from closest to furthest
			tempMensen.sort((firstItem, secondItem) => firstItem.distance - secondItem.distance)
			
			// Setting the State so the data gets updated
			setMensen(tempMensen)
		}

		if(!navigator.geolocation) {
			console.error('Geolocation is not supported by your browser');
		} else {
			navigator.geolocation.getCurrentPosition(success, (e) => console.log(e));
		}
	}


	useEffect(() => {
		// TODO: Check if user wants to give location data
		getLocation()
		setMensen(mensaData)


		mensaData.map(mensa => {
			getOpeningString(mensa.url).then((data) => {
				const mensaId = mensaData.findIndex((item) => item.url === mensa.url)
				setMensen(mensen => {
					mensen[mensaId].openingString = data.openingString
					return mensen
				})
			})

			// Get ID of the current Mensa
			
		})
	}, [])


	useEffect(() => {
		console.log(mensen)
	}, [mensen])

  return (
    <div className="p-4 pb-0 space-y-6 lg:w-1/2 lg:px-0 lg:pb-4 lg:mx-auto flex flex-col h-screen justify-between">
      <Head>
        <title>Mensa Radar — Mensen Potsdam</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="m-1 mb-3">
          <h2 className="text-xl">Mensen</h2>
        </div>
        <div className="flex flex-col divide-y-2 border-y-2 divide-main-black/20 bg-green-3 rounded-xl bg-background-container py-0.5
        ">
          {
            mensen.map(mensa => {
              return <Link href={'/mensa/'+mensa.url}>
                      <a className="flex py-3 px-6 justify-between">
                        <div className="flex flex-col space-y-0.5 justify-start">
                          <h3 className="text-xl font-normal font-bigtext">{mensa.name}</h3>
                          <div className="flex">
                            <div className="rounded-full w-2 h-2 bg-sec-green-dark mr-1 my-auto"></div>
                            <span className="font-serif text-s opacity-60">{mensa.openingString}</span>
                          </div> 
                        </div>
                        <div className="flex pb-1">
                          {
                            // Display Distance if Location Permissions are granted
                            // true ? <></>
                            locationPermission ? <> 
                              <span className="bg-main-white py-0 rounded-full inline-flex text-green-w7 px-3 gap-2 m-auto">
                                 <img src="location.svg"></img>
                                <span>{mensa.distance}km</span>
                              </span>
                            </> : null
                          }
                        </div>
                      </a>
                    </Link>
            })
          }
        </div>
      </main>
          <Footer />
    </div>
  );
}
//{ mensa.openingString }