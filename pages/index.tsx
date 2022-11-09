import { useEffect, useLayoutEffect, useState } from "react";

import Head from "next/head";
import Link from 'next/link';

import Footer from "../components/footer";
import { getTempOpeningString } from "../lib/getOpeningString";
import { createClient } from "@supabase/supabase-js";


export default function Home(props) {
	const {mensaData} = props;
	const d = new Date();
	const currentTime = d.getHours() + d.getMinutes()/60
	const currentDay = d.getDay()

	const [mensen, setMensen] = useState(mensaData);
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
				const distance = getDistanceFromLatLonInKm(latitude, longitude, mensa.loc_lat, mensa.loc_long)
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
	}

	useEffect(() => {
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
              return <Link href={'/mensa/'+mensa.url}>
                      <a className="flex py-3 px-6 justify-between">
                        <div className="flex flex-col space-y-0.5 justify-start">
                          
							
							<h3 className="text-xl font-normal font-bigtext"> {mensa.name}</h3>
							 
							<div className="flex h-6 font-serif text-s">
								{ 
									mensa.open? <>  
									<div className="rounded-full w-2 h-2 bg-sec-green-dark mr-2 my-auto"></div>
									</> : null
								}
								
								<span className="opacity-60"> { mensa.openingString } </span>
								
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

export async function getStaticProps(context) {
	const { data: mensen, error: mensenError } = await supabase
		.from('mensen')
		.select()

	const { data: currentMensaData, error: currentMensaDataError } = await supabase
		.from('current_mensa_data')
		.select()

	const mensaData = mensen.map(async mensa => {
		const currentMensa = currentMensaData.find((currentMensa) => currentMensa.mensa === mensa.id)
		return {
			...mensa,
			...currentMensa,
			openingString: await getTempOpeningString(currentMensa)
		}
	})

	const mensaDataResolved = await Promise.all(mensaData)

	return {
		props: { 
			mensaData: mensaDataResolved 
		},
		revalidate: 60
	}
}