/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import "tailwindcss/tailwind.css"

import { getWeekdayByName } from "../../../../lib/getWeekdayByName"

import Head from "next/head"
import Link from "next/link"
import Modal from "react-modal"
import { SelectMensa } from "../../../../components/SelectMensa"
import { NutrientOverview } from "../../../../components/nutrients/nutrientOverview"
import { Pill } from "../../../../components/pill"
import { getOpeningTimes } from "../../../../lib/getOpeningString"
import { Offer } from "../../../../components/offer/offer"

import { gt, asc, desc, eq, sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/postgres-js"
import { motion } from "framer-motion"
import { GetServerSideProps } from "next"
import { usePlausible } from "next-plausible"
import Image from "next/image"
import postgres from "postgres"
import { BugReportButton } from "../../../../components/bugReportButton"
import { NoFood } from "../../../../components/errors/NoFood"
import useScrollPosition from "../../../../hooks/useScrollPosition"
import {
	currentMensaData,
	foodOfferings,
	mensen,
} from "../../../../server/dbSchema"

type DrizzleFoodQuery = {
	name: string
	url: string
	locLat: string
	locLong: string
	foodOfferings: NewFoodOffer[]
}

type DrizzleMensenQuery = EnhancedMensaList[]

export const runtime = "experimental-edge"

const blobToBase64: (blob: any) => Promise<string> = (blob) => {
	const reader = new FileReader()
	reader.readAsDataURL(blob)
	return new Promise((resolve: (val: string) => void) => {
		reader.onloadend = () => {
			resolve(reader.result.toString())
		}
	})
}

export default function Mensa({
	food,
	mensenListReq,
}: {
	food: DrizzleFoodQuery
	mensenListReq: string // JSON Stringified
}): JSX.Element {
	const router = useRouter()
	const { mensa, day } =
		router.query !== undefined
			? router.query
			: { mensa: "fhp", day: "freitag" }

	const mensenList: DrizzleMensenQuery = JSON.parse(mensenListReq)
	const currentMensa = mensenList.find((m) => m.url === mensa)

	const [mensaOpen, setMensaOpen] = useState(false)
	const [mensaOpenText, setMensaOpenText] = useState(
		"Öffnungszeiten werden geladen"
	)

	const [path, setPath] = useState(router.asPath.split("#"))

	useEffect(() => {
		setModalOpen(false)
	}, [mensa, day])

	// get current weekday
	const selectedWeekday = getWeekdayByName(day)

	// Subtracting one to start with monday
	// const currentWeekday = new Date().getDate() - ((new Date().getDay() + 6) % 7) - 1;
	const currentDate = new Date()
	const currentWeekday =
		currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1
	const days = ["montag", "dienstag", "mittwoch", "donnerstag", "freitag"]

	const [modalOpen, setModalOpen] = useState(false)
	const [currentModalContent, setCurrentModalContent] = useState("")
	const plausible = usePlausible()

	const openNutrientsFlow = () => {
		setCurrentModalContent("nutrients")
		setModalOpen(true)
		plausible("View Nutrients")
	}
	const openMensaSelectionFlow = () => {
		setCurrentModalContent("mensaSelection")
		setModalOpen(true)
	}

	const fullsizeModal = {
		content: {
			top: 0,
			left: 0,
			height: "100%",
			width: "100%",
			border: "none",
			borderRadius: 0,
			inset: 0,
			padding: 0,
		},
	}
	const resizedModal = {
		content: {
			top: "-8px",
			left: "50%",
			right: "auto",
			bottom: "auto",
			marginRight: "-50%",
			transform: "translate(-50%, 0)",
			border: "none",
			background: "none",
		},
	}

	const scrollPosition = useScrollPosition(50)

	async function uploadBase64toSupabase(base64: string, foodId: number) {
		const blurhash = await encodeImageToBlurhash(
			"data:image/png;base64," + base64
		)

		if (base64 !== "" && base64 !== undefined && foodId) {
			fetch(
				`${
					process.env.NODE_ENV === "development"
						? "http://localhost:3000"
						: "https://mensa-radar.de"
				}/api/ai/uploadThumbnail/`,
				{
					method: "POST",
					body: JSON.stringify({
						foodId: foodId,
						base64: base64,
						blurhash,
					}),
				}
			)
		}
	}
	const [generatedThumbnails, setGeneratedThumbnails] = useState(
		new Map<number, string>()
	)
	async function queueThumbnailGeneration() {
		for await (const offer of food.foodOfferings) {
			if (
				offer.foodImages.length === 0 &&
				!offer.hasAiThumbnail &&
				!offer.soldOut
			) {
				console.log("Starting Generation")
				await aiThumbnailGeneration(offer.id, offer.foodTitle)
			}
		}
	}
	async function aiThumbnailGeneration(foodId: number, foodTitle: string) {
		const isFoodOffer =
			food.foodOfferings.find((offer) => offer.id === foodId)
				?.priceOther !== 0 &&
			food.foodOfferings.find((offer) => offer.id === foodId)
				?.priceStudents !== 0
		if (!isFoodOffer) return
		console.log("Generating AI Thumbnail")
		return await fetch(
			`${
				process.env.NODE_ENV === "development"
					? "http://localhost:3000"
					: "https://mensa-radar.de"
			}/api/ai/generateThumbnail/`,
			{
				method: "POST",
				body: JSON.stringify({
					foodId: foodId,
					foodTitle: foodTitle,
				}),
			}
		)
			.then(async (res) => {
				console.log(res)

				if (res.status === 200) {
					const blob = await res.blob()
					const base64 = await blobToBase64(blob)
					console.log(blob, base64)
					uploadBase64toSupabase(base64, foodId)
					setGeneratedThumbnails(
						new Map(generatedThumbnails.set(foodId, base64))
					)
				}
				// if (res.message === "success") {
				// 	console.log(res.image)
				// 	uploadBase64toSupabase(
				// 		await blobToBase64(res.image),
				// 		foodId
				// 	)
				// 	setGeneratedThumbnails(
				// 		new Map(generatedThumbnails.set(foodId, res.base64))
				// 	)
				// }
			})
			.catch((err) => console.log(err))
	}

	const updateOpeningTimes = () => {
		const { open, text } = getOpeningTimes(currentMensa)
		setMensaOpen(open)
		setMensaOpenText(text)
	}

	useEffect(() => {
		setModalOpen(false)
		updateOpeningTimes()
		queueThumbnailGeneration()
		// Update the Opening Times every minute
		const interval = setInterval(() => {
			updateOpeningTimes()
		}, 60 * 1000)

		return () => clearInterval(interval)
	}, [router.asPath])

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.3,
			},
		},
	}

	const headTitle = `${currentMensa.name} - Mensa Radar`

	return (
		<>
			<Modal
				isOpen={modalOpen}
				onRequestClose={() => setModalOpen(false)}
				style={
					currentModalContent === "nutrients"
						? fullsizeModal
						: resizedModal
				}>
				{currentModalContent === "nutrients" ? (
					<>
						<NutrientOverview
							foodOffers={food.foodOfferings}
							setModalOpen={setModalOpen}
						/>
					</>
				) : (
					<>
						<SelectMensa
							setModalOpen={setModalOpen}
							currentMensa={mensa}
							mensen={mensenList}
						/>
					</>
				)}
			</Modal>
			<div className="mx-auto flex flex-col">
				<Head>
					<title>{headTitle}</title>
				</Head>

				<div
					className={`fixed p-3 ${
						modalOpen ? null : "z-10"
					} w-full border-b border-gray/10 bg-light-green`}>
					<div className="m-auto w-full divide-y divide-gray/20 rounded-xl border border-solid border-gray/20 sm:max-w-xl">
						<div
							onClick={() => openMensaSelectionFlow()}
							className="flex h-12 w-full flex-row items-center justify-center gap-2 space-x-2">
							<h1 className="text-h1 block font-serif-bold">
								{currentMensa.name}
							</h1>
							<Image
								src="/icons/chev-down.svg"
								width={16}
								height={16}
								className="mt-[2px]"
								alt="Icon pointing downwards"
							/>
						</div>
						<div className="flex h-10 w-full flex-row items-center justify-between px-4">
							{selectedWeekday > 0 ? (
								<>
									<Link
										href={`/mensa/${mensa}/${
											days[selectedWeekday - 1]
										}`}>
										<a className="inline-flex grow basis-0 flex-row items-center gap-1 font-sans-med text-sm">
											<Image
												src="/icons/right-arrw.svg"
												width={16}
												height={16}
												className="w-4 rotate-180"
												alt="Icon pointing to the right"
											/>

											<p className="capitalize">
												{currentWeekday ===
												selectedWeekday
													? "Gestern"
													: currentWeekday ===
													  selectedWeekday - 1
													? "Heute"
													: days[selectedWeekday - 1]}
											</p>
										</a>
									</Link>
								</>
							) : (
								<div className="mr-auto w-20 grow basis-0 text-left font-sans-bold text-sm"></div>
							)}
							<p className="font-sans-semi text-sm capitalize">
								{currentWeekday === selectedWeekday
									? "Heute"
									: selectedWeekday === currentWeekday + 1
									? "Morgen"
									: selectedWeekday === currentWeekday - 1
									? "Gestern"
									: days[selectedWeekday]}
							</p>
							{selectedWeekday < 4 ? (
								<>
									<Link
										href={`/mensa/${mensa}/${
											days[selectedWeekday + 1]
										}`}>
										<a className="inline-flex grow basis-0 flex-row items-center gap-1 text-right font-sans-med text-sm">
											<p className="w-full capitalize">
												{currentWeekday ===
												selectedWeekday
													? "Morgen"
													: currentWeekday ===
													  selectedWeekday + 1
													? "Heute"
													: days[selectedWeekday + 1]}
											</p>

											<Image
												src="/icons/right-arrw.svg"
												width={16}
												height={16}
												className="w-4"
												alt="Icon pointing to the right"
											/>
										</a>
									</Link>
								</>
							) : (
								<div className="mr-auto w-20 grow basis-0 text-left font-sans-bold text-sm text-black"></div>
							)}
						</div>
						{scrollPosition ? (
							<>
								<div className="flex h-10 w-full flex-row items-center justify-center px-4 pb-1 text-gray/70">
									<Pill col={"transparent"}>
										<div
											className={`mr-1 h-2 w-2 rounded-full ${
												mensaOpen
													? `bg-dark-green`
													: ` bg-red-500`
											}`}></div>
										<p className="font-sans-reg text-sm">
											{currentMensa.url === undefined
												? ""
												: mensaOpenText}
										</p>
									</Pill>
								</div>
							</>
						) : null}
					</div>
				</div>
				{day}
				{day === "samstag" || day === "sonntag" ? (
					<div className="flex h-screen w-full items-center justify-center">
						<NoFood mainMessage="Ab Montag gibt's hier wieder Essen!" />
					</div>
				) : food.foodOfferings?.length === 0 ? (
					<div className="flex h-screen w-full items-center justify-center">
						<NoFood mainMessage="Bald gibt's hier wieder Essen!" />
					</div>
				) : null}

				<motion.div
					className="hide-scroll-bar flex w-full snap-y snap-proximity flex-col gap-4 overflow-y-scroll px-3 pt-32"
					variants={container}
					initial="hidden"
					animate="show">
					{food.foodOfferings?.map((offer) => {
						return (
							<Offer
								key={offer.id}
								offer={offer}
								mensa={mensa}
								day={router.query.day}
								aiThumbnailBase64={generatedThumbnails.get(
									offer.id
								)}
								triggerAiThumbnailRegeneration={
									aiThumbnailGeneration
								}
							/>
						)
					})}
					<BugReportButton />
				</motion.div>

				{scrollPosition ? (
					<>
						<div className="fixed bottom-0 h-10 w-full border-gray/10 bg-light-green px-3 py-2">
							<div className="m-auto grid max-w-xl grid-cols-2">
								<div className="flex flex-row space-x-2">
									<Link href="/impressum">
										<a className="text-sm opacity-50">
											Über Mensa-Radar
										</a>
									</Link>
								</div>
								{day === "samstag" ||
								day === "sonntag" ||
								food.foodOfferings?.length === 0 ? null : (
									<div
										className="flex cursor-pointer items-center space-x-1"
										onClick={() => openNutrientsFlow()}>
										<p className="w-full text-right text-sm">
											Nährwerte vgl.
										</p>
										<Image
											src="/icons/right-arrw.svg"
											width={16}
											height={16}
											className="w-4"
											alt="Icon pointing to the right"
										/>
									</div>
								)}
							</div>
						</div>
					</>
				) : null}
			</div>
		</>
	)
}

import * as schema from "../../../../server/dbSchema"
import { set } from "zod"
import { encode } from "blurhash"
import { encodeImageToBlurhash } from "../../../../lib/blurhashFromImage"

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { mensa, day } = context.params

	const selectedWeekday = getWeekdayByName(day)
	let currentWeekday = new Date().getDay()
	currentWeekday = currentWeekday === 0 ? 6 : currentWeekday - 1
	let selectedDay = new Date()
	selectedDay.setDate(
		selectedDay.getDate() + (selectedWeekday - currentWeekday)
	)

	const connectionString = process.env.DATABASE_URL
	const client = postgres(connectionString)
	const db = drizzle(client, { schema })
	const food = await db.query.mensen.findFirst({
		columns: {
			createdAt: false,
			id: false,
		},
		where: eq(mensen.url, mensa.toString()),
		with: {
			foodOfferings: {
				where: eq(foodOfferings.date, selectedDay),
				columns: {
					id: true,
					foodTitle: true,
					vegan: true,
					vegetarian: true,
					fish: true,
					meat: true,
					nutrients: true,
					allergens: true,
					priceStudents: true,
					priceOther: true,
					soldOut: true,
					hasAiThumbnail: true,
					blurhash: true,
				},
				orderBy: [
					asc(foodOfferings.soldOut),
					desc(foodOfferings.vegan),
					desc(foodOfferings.vegetarian),
					desc(foodOfferings.fish),
					desc(foodOfferings.meat),
				],
				with: {
					qualityReviews: {
						columns: {
							rating: true,
							userSessionId: true,
						},
					},
					foodImages: {
						columns: {
							imageName: true,
							imageUrl: true,
						},
					},
				},
			},
		},
	})

	const mensenList = await db
		.select({
			id: foodOfferings.mensa,
			nextFood: sql<Date>`min(food_offerings.date)`,
			name: mensen.name,
			url: mensen.url,
			locLat: mensen.locLat,
			locLong: mensen.locLong,
			openingTimes: currentMensaData.openingTimes,
			enabled: currentMensaData.enabled,
		})
		.from(foodOfferings)
		.innerJoin(mensen, eq(foodOfferings.mensa, mensen.id))
		.innerJoin(
			currentMensaData,
			eq(foodOfferings.mensa, currentMensaData.mensaId)
		)
		.where(gt(foodOfferings.date, sql`current_date`))
		.groupBy(
			sql`food_offerings.mensa, mensen.name, mensen.url, current_mensa_data."openingTimes", mensen.loc_lat, mensen.loc_long, current_mensa_data.enabled`
		)

	await client.end()

	return {
		props: {
			food: food,
			mensenListReq: JSON.stringify(mensenList),
		},
	}
}
