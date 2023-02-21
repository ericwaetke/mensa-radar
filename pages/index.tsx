import { useEffect, useState } from "react";

import Head from "next/head";
import Link from 'next/link';

import { createClient } from "@supabase/supabase-js";
import Footer from "../components/footer";
import { getOpeningTimes } from "../lib/getOpeningString";
import { useRouter } from "next/router";


export default function Home(props) {
	const router = useRouter()

	const { mensaData }: {mensaData: MensaData[]} = props;
	const d = new Date();
	const currentTime = d.getHours() + d.getMinutes() / 60
	const currentDay = d.getDay()

	const [mensen, setMensen] = useState(mensaData);
	const [locationPermission, setLocationPermission] = useState(false)
	const [locationLoaded, setLocationLoaded] = useState(false)

	const [openingTimes, setOpeningTimes] = useState<{
		[mensaId: string]: {
			open: boolean;
			text: string;
		}
	}>();

	const getLocation = () => {
		const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
			const earthRadius = 6371; // Radius of the earth in km
			const dLat = deg2rad(lat2 - lat1);
			const dLon = deg2rad(lon2 - lon1);
			var a =
				Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
				Math.sin(dLon / 2) * Math.sin(dLon / 2)
				;
			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

			return earthRadius * c;
		}

		const deg2rad = (deg) => deg * (Math.PI / 180)

		const success = (data) => {
			setLocationPermission(true)
			// User Coords
			const { latitude, longitude } = data.coords

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

			// Get nearest Mensa and redirect client
			const nearestMensa = tempMensen[0]
			router.push(`/mensa/${nearestMensa.url}`)
			console.log("redirecting to", nearestMensa)

			// Setting the State so the data gets updated
			setMensen(tempMensen)
			setLocationLoaded(true);
		}

		if (!navigator.geolocation) {
			console.error('Geolocation is not supported by your browser');

		} else {
			navigator.geolocation.getCurrentPosition(success, (e) => console.log("error getting location: ",e));
			setLocationLoaded(true);
		}
	}

	const updateOpeningTimes = () => {
		const tempOpeningTimes = {}
		for (let i = 0; i < mensaData.length; i++) {
			const mensa = mensaData[i]
			console.log(mensa)
			console.log(getOpeningTimes(mensa))
			tempOpeningTimes[mensa.id] = getOpeningTimes(mensa)
		}
		setOpeningTimes(tempOpeningTimes)
	}

	useEffect(() => {
		getLocation()
		updateOpeningTimes()
		//Update the Opening Times every minute
		const interval = setInterval(() => {
			updateOpeningTimes()
		}, 60 * 1000);

		return () => clearInterval(interval);
	}, [])

	return (
		<div className="p-2 pt-8 pb-0 space-y-6 max-w-xl m-auto lg:px-0 lg:pb-4 lg:mx-auto flex flex-col h-screen box-border wrap">
			<Head>
				<title>Mensa-Radar — Mensen Potsdam</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="w-full flex justify-center">
				<h1 className="text-h1 font-serif-bold">Mensa-Radar</h1>
			</div>


			<main className="flex flex-col h-full">
				<div className="flex max-w-xl flex-col divide-y  divide-gray/20 rounded-xl bg-white pl-4 py-0.5">
					{
						mensen.map(mensa => {
							return <Link href={'/mensa/' + mensa.url} key={mensa.id}>
								<a className="flex  py-4 pr-4 justify-between space-x-2">
									<h3 className="text-xl font-normal font-serif-semi"> {mensa.name}</h3>
									<div className="flex font-sans-reg text-s items-center h-full">
										<div className={`rounded-full w-2 h-2 mr-2 my-auto ${openingTimes?.[mensa.id]?.open ? "bg-main-green" : "bg-red-500"}`}></div>
										<span className="opacity-60 whitespace-nowrap"> {openingTimes?.[mensa.id]?.text} </span>
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

	const dateFormated = new Date().toISOString().split('T')[0]
	const { data: daysWithFoodUnfiltered, error: daysWithFoodUnfilteredError } = await supabase
		.from('food_offerings')
		.select('mensa, date')
		.gte('date', dateFormated)

	const mensaData = mensen?.map(mensa => {
		const currentMensaDataForMensa = currentMensaData?.find(mensaData => mensaData.mensa === mensa.id);
		const daysWithFood = [...new Set(daysWithFoodUnfiltered?.filter((day) => day.mensa === mensa.id).map((day) => day.date))];
		
		return {
			...mensa,
			...currentMensaDataForMensa,
			daysWithFood
		}
	})

	return {
		props: {
			mensaData
		},
		revalidate: 60
	};
}