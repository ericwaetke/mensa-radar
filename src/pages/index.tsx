/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"

import Head from "next/head"
import Link from "next/link"

import { createClient } from "@supabase/supabase-js"
import Footer from "../components/footer"
import { getOpeningTimes } from "../lib/getOpeningString"
import { useRouter } from "next/router"
import { env } from "../env.mjs"
import { BugReportButton } from "../components/bugReportButton"

export const runtime = "experimental-edge"

export default function Home(props) {
	const router = useRouter()

	const { mensaData }: { mensaData: MensaData[] } = props
	const d = new Date()
	const currentTime = d.getHours() + d.getMinutes() / 60
	const currentDay = d.getDay()

	const [mensen, setMensen] = useState(mensaData)
	const [locationPermission, setLocationPermission] = useState(false)
	const [locationLoaded, setLocationLoaded] = useState(false)

	const [openingTimes, setOpeningTimes] = useState<{
		[mensaId: string]: {
			open: boolean
			text: string
		}
	}>()

	const getLocation = () => {
		const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
			const earthRadius = 6371 // Radius of the earth in km
			const dLat = deg2rad(lat2 - lat1)
			const dLon = deg2rad(lon2 - lon1)
			var a =
				Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(deg2rad(lat1)) *
					Math.cos(deg2rad(lat2)) *
					Math.sin(dLon / 2) *
					Math.sin(dLon / 2)
			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

			return earthRadius * c
		}

		const deg2rad = (deg) => deg * (Math.PI / 180)

		const success = (data) => {
			setLocationPermission(true)
			// User Coords
			const { latitude, longitude } = data.coords

			let tempMensen = []
			mensaData.map((mensa) => {
				const distance = getDistanceFromLatLonInKm(
					latitude,
					longitude,
					mensa.loc_lat,
					mensa.loc_long
				)
				tempMensen.push({
					...mensa,
					distance: Math.round(distance * 10) / 10,
				})
			})

			// Sorting Mensas from closest to furthest
			tempMensen.sort(
				(firstItem, secondItem) =>
					firstItem.distance - secondItem.distance
			)

			// Get nearest Mensa and redirect client
			const nearestMensa = tempMensen[0]
			router.push(`/mensa/${nearestMensa.url}`)
			console.log("redirecting to", nearestMensa)

			// Setting the State so the data gets updated
			setMensen(tempMensen)
			setLocationLoaded(true)
		}

		if (!navigator.geolocation) {
			console.error("Geolocation is not supported by your browser")
		} else {
			navigator.geolocation.getCurrentPosition(success, (e) =>
				console.log("error getting location: ", e)
			)
			setLocationLoaded(true)
		}
	}

	const updateOpeningTimes = () => {
		const tempOpeningTimes = {}
		for (let i = 0; i < mensaData.length; i++) {
			const mensa = mensaData[i]
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
		}, 60 * 1000)

		return () => clearInterval(interval)
	}, [])

	const currentDate = new Date()
	const currentWeekday =
		currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1
	const weekday = [
		"montag",
		"dienstag",
		"mittwoch",
		"donnerstag",
		"freitag",
		"samstag",
		"sonntag",
	]

	return (
		<div className="m-auto box-border flex min-h-screen flex-col items-center space-y-6 p-2 py-4 lg:mx-auto lg:px-0">
			<Head>
				<link rel="icon" href="/favicon.ico" />

				{/* <!-- HTML Meta Tags --> */}
				<title>Mensa-Radar — Mensen Potsdam</title>
				<meta
					name="description"
					content="Alle Essen der Potsdamer Mensen. Mit Bildern und ✨AI✨"
				/>

				{/* <!-- Facebook Meta Tags --> */}
				<meta property="og:url" content="https://mensa-radar.de" />
				<meta property="og:type" content="website" />
				<meta
					property="og:title"
					content="Mensa-Radar — Mensen Potsdam"
				/>
				<meta
					property="og:description"
					content="Alle Essen der Potsdamer Mensen. Mit Bildern und ✨AI✨"
				/>
				<meta property="og:image" content="/share_root.png" />

				{/* <!-- Twitter Meta Tags --> */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta property="twitter:domain" content="mensa-radar.de" />
				<meta property="twitter:url" content="https://mensa-radar.de" />
				<meta
					name="twitter:title"
					content="Mensa-Radar — Mensen Potsdam"
				/>
				<meta
					name="twitter:description"
					content="Alle Essen der Potsdamer Mensen. Mit Bildern und ✨AI✨"
				/>
				<meta name="twitter:image" content="/share_root.png" />
			</Head>
			<div className="flex w-full justify-center">
				<h1 className="text-h1 font-serif-bold">Mensa-Radar</h1>
			</div>

			<main className="flex h-full max-w-xl flex-col gap-4 lg:mx-auto">
				<div className="flex max-w-xl flex-col divide-y  divide-gray/20 rounded-xl bg-white py-0.5 pl-4">
					{mensen.map((mensa) => {
						const redirectWeekday =
							openingTimes?.[mensa.id]?.open ||
							currentWeekday === 5 ||
							currentWeekday === 6
								? weekday[currentWeekday]
								: weekday[currentWeekday + 1]
						return mensa.current_mensa_data[0].enabled ? (
							<Link
								href={`/mensa/${mensa.url}/${redirectWeekday}`}
								key={mensa.id}>
								<a className="flex items-center justify-between space-x-2 py-4 pr-4">
									<h3 className="font-serif-semi text-xl font-normal">
										{" "}
										{mensa.name}
									</h3>
									<div className="flex h-full items-center font-sans-reg text-sm">
										<div
											className={`my-auto mr-2 h-2 w-2 rounded-full ${
												openingTimes?.[mensa.id]?.open
													? "bg-main-green"
													: "bg-red-500"
											}`}></div>
										<span className="whitespace-nowrap opacity-60">
											{" "}
											{
												openingTimes?.[mensa.id]?.text
											}{" "}
										</span>
									</div>
								</a>
							</Link>
						) : null
					})}
				</div>
				<BugReportButton />
			</main>
			<Footer />
		</div>
	)
}
//{ mensa.openingString }

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function getStaticProps(context) {
	const { data: mensen, error: mensenError } = await supabase.from("mensen")
		.select(`
		id,
		name,
		loc_lat,
		loc_long,
		url,
		current_mensa_data (
			openingTimes,
			enabled
		)`)

	const dateFormated = new Date().toISOString().split("T")[0]
	const { data: daysWithFoodUnfiltered, error: daysWithFoodUnfilteredError } =
		await supabase
			.from("food_offerings")
			.select("mensa, date")
			.gte("date", dateFormated)

	const mensaData = mensen?.map((mensa) => {
		const daysWithFood = [
			...new Set(
				daysWithFoodUnfiltered
					?.filter((day) => day.mensa === mensa.id)
					.map((day) => day.date)
			),
		]

		return {
			...mensa,
			daysWithFood,
		}
	})

	return {
		props: {
			mensaData,
		},
		revalidate: 60,
	}
}
