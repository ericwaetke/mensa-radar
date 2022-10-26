import { use, useEffect, useState } from "react";

import Head from "next/head";
import Link from 'next/link';

import Footer from "../components/footer";

export const mensaData = [
	{
		name: "Golm",
		url: "golm",
		coords: {
			latitude: 52.40795670687466, 
			longitude: 12.978685326538164
		},
		distance: 0,
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
		closing: 14.5,
		open: false
	},
	{
		name: "Neues Palais",
		url: "neues-palais",
		coords: {
			latitude: 52.402868541881624, 
			longitude: 13.011995232289776
		},
		distance: 0,
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
		closing: 14.5,
		open: false
	},
	{
		name: "FHP",
		url: "fhp",
		coords: {
			latitude: 52.41324028310374, 
			longitude: 13.051182387706824 
		},
		distance: 0,
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
		closing: 14.5,
		open: false
	},
	{
		name: "Brandenburg an der Havel",
		url: "brandenburg",
		coords: {
			latitude: 52.41159566949572,
			longitude: 12.539779153390663
		},
		distance: 0,
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
		closing: 14,
		open: false
	},
	{
		name: "Filmuniversität",
		url: "filmuniversitaet",
		coords: {
			latitude: 52.38889031847045, 
			longitude: 13.116692300009127
		},
		distance: 0,
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
		closing: 14.5,
		open: false
	},
	{
		name: "Griebnitzsee",
		url: "griebnitzsee",
		coords: {
			latitude: 52.393549668399444, 
			longitude: 13.12775872728105
		},
		distance: 0,
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
		closing: 14.5,
		open: false
	},
	{
		name: "Wildau",
		url: "wildau",
		coords: {
			latitude: 52.31913645920946, 
			longitude: 13.632358896246892
		},
		distance: 0,
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
		closing: 15,
		open: false
	}
]

export default function Page() {
	const d = new Date();
	const currentTime = d.getHours() + d.getMinutes()/60
	const currentDay = d.getDay()

	const [mensen, setMensen] = useState(mensaData)
	const [locationPermission, setLocationPermission] = useState(false)

	const [locationLoaded, setLocationLoaded] = useState(false);


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
			setLocationLoaded(true);
		}
		
		if(!navigator.geolocation) {
			console.error('Geolocation is not supported by your browser');
			
		} else {
			navigator.geolocation.getCurrentPosition(success, (e) => console.log(e));
			setLocationLoaded(true);
		}

		navigator.permissions.query({name:'geolocation'}).then(function(result) {
			if (result.state == 'granted') {
				setLocationPermission(true)
			} else if (result.state == 'prompt') {
				setLocationPermission(false)
			} else if (result.state == 'denied') {
				setLocationPermission(false)
			}
			result.onchange = function() {
				if (result.state == 'granted') {
					setLocationPermission(true)
				} else if (result.state == 'prompt') {
					setLocationPermission(false)
				} else if (result.state == 'denied') {
					setLocationPermission(false)
				}
			}
		})
	}


	useEffect(() => {
		// TODO: Check if user wants to give location data
		getLocation()
	}, [])

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
              return <Link href={'/mensa/'+mensa.url} className="flex py-3 px-6 justify-between">
                        <div className="flex flex-col space-y-0.5 justify-start">
                          
							{
						 	 !locationLoaded ? <>
							  <div role="status" className="animate-pulse m-auto">
								  <div className="h-6 bg-white rounded-md dark:bg-gray-700 w-60"></div>
								  <span className="sr-only">lädt</span>
							  </div>
							  </> : <h3 className="text-xl font-normal font-bigtext"> {mensa.name}</h3>
							} 
                          <div className="flex h-6 font-serif text-s">
							{ 
								mensa.open? <>  
                            	<div className="rounded-full w-2 h-2 bg-sec-green-dark mr-2 my-auto"></div>
								</> : null
							}
							{
								mensa.openingString === "Loading Opening Times"? <>
								<div role="status" className="animate-pulse h-4 my-1">
									<div className="h-4 bg-white rounded-full dark:bg-gray-700 w-48 mb-4"></div>
									<span className="sr-only">lädt</span>
								</div>
								</> : <span className="opacity-60"> { mensa.openingString } </span>
							}
                          </div> 
                        </div>
                        <div className="flex pb-1">
                          {
                            // Display Distance if Location Permissions are granted
                            // true ? <></>
							!locationLoaded ? <>
									<div role="status" className="animate-pulse m-auto">
										<div className="h-6 bg-white rounded-full dark:bg-gray-700 w-24"></div>
										<span className="sr-only">lädt</span>
									</div>
									</> : locationPermission ? <> 
										<span className="bg-main-white py-0 rounded-full inline-flex text-green-w7 px-3 gap-2 m-auto">
											<img src="location.svg"></img><span> { mensa.distance }km</span>		
										</span>		 
                           				</> : null
                          }
                        </div>
                    </Link>
            })
          }
        </div>
      </main>
          <Footer />
    </div>
  );
}