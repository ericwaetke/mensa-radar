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

import { and, eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/postgres-js"
import { motion } from "framer-motion"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { usePlausible } from "next-plausible"
import dynamic from "next/dynamic"
import Image from "next/image"
import postgres from "postgres"
import { BugReportButton } from "../../../../components/bugReportButton"
import { NoFood } from "../../../../components/errors/NoFood"
import useScrollPosition from "../../../../hooks/useScrollPosition"
import {
	currentMensaData,
	foodImages,
	foodOfferings,
	mensen,
	qualityReviews,
} from "../../../../server/dbSchema"

const DynamicOffer = dynamic<{
	offer: NewFoodOffer
	mensa: string | string[]
	day: string | string[]
	triggerAiThumbnailRegeneration: (foodId: number, foodTitle: string) => void
	aiThumbnailBase64: string
}>(
	() => import("../../../../components/offer/offer").then((mod) => mod.Offer),
	{
		loading: () => <p>Loading...</p>,
	}
)

type DrizzleFoodQuery = {
	name: string
	url: string
	locLat: string
	locLong: string
	foodOfferings: NewFoodOffer[]
}

export const runtime = "experimental-edge"

export default function Mensa({
	food,
	mensenList,
}: {
	food: DrizzleFoodQuery
	mensenList: any
}): JSX.Element {
	const router = useRouter()
	const { mensa, day } =
		router.query !== undefined
			? router.query
			: { mensa: "fhp", day: "freitag" }

	const [openingTimes, setOpeningTimes] = useState<{
		open: boolean
		text: string
	}>({ open: false, text: "" })

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

	function uploadBase64toSupabase(base64: string, foodId: number) {
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
					}),
				}
			)
		}
	}
	const [generatedThumbnails, setGeneratedThumbnails] = useState(
		new Map<number, string>()
	)
	// async function queueThumbnailGeneration() {
	// 	for await (const offer of foodOffers as FoodOffering[]) {
	// 		if (
	// 			offer.food_images.length === 0 &&
	// 			!offer.has_ai_thumbnail &&
	// 			!offer.sold_out
	// 		) {
	// 			console.log("Starting Generation")
	// 			await aiThumbnailGeneration(offer.id, offer.food_title)
	// 		}
	// 	}
	// }
	async function aiThumbnailGeneration(foodId: number, foodTitle: string) {
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
			.then((res) => res.json())
			.then((res) => {
				if (res.message === "success") {
					uploadBase64toSupabase(res.base64, foodId)
					setGeneratedThumbnails(
						new Map(generatedThumbnails.set(foodId, res.base64))
					)
				}
			})
			.catch((err) => console.log(err))
	}

	// useEffect(() => {
	// 	setModalOpen(false)
	// 	setOpeningTimes(getOpeningTimes(currentMensa))
	// 	queueThumbnailGeneration()
	// 	// Update the Opening Times every minute
	// 	const interval = setInterval(() => {
	// 		setOpeningTimes(getOpeningTimes(currentMensa))
	// 	}, 60 * 1000)

	// 	return () => clearInterval(interval)
	// }, [router.asPath])

	// const getFoodDataById = (id: string): FoodOffering => {
	// 	return foodOffers.find(
	// 		(foodOffer: FoodOffering) => foodOffer.id === parseInt(id)
	// 	)
	// }

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

	const currentMensa = {
		name: "fhp",
		url: "fhp",
	}

	// const headTitle = `${currentMensa.name} - Mensa Radar`

	return (
		<>
			{/* <Modal
				isOpen={modalOpen}
				onRequestClose={() => setModalOpen(false)}
				style={
					currentModalContent === "nutrients"
						? fullsizeModal
						: resizedModal
				}
			>
				{currentModalContent === "nutrients" ? (
					<>
						<NutrientOverview
							foodOffers={foodOffers}
							setModalOpen={setModalOpen}
						/>
					</>
				) : (
					<>
						<SelectMensa
							setModalOpen={setModalOpen}
							currentMensa={mensa}
							mensen={mensaList}
						/>
					</>
				)}
			</Modal> */}
			<div className="mx-auto flex flex-col">
				<Head>{/* <title>{headTitle}</title> */}</Head>

				<div
					className={`fixed p-3 ${
						modalOpen ? null : "z-10"
					} w-full border-b border-gray/10 bg-light-green`}
				>
					<div className="m-auto w-full divide-y divide-gray/20 rounded-xl border border-solid border-gray/20 sm:max-w-xl">
						<div
							onClick={() => openMensaSelectionFlow()}
							className="flex h-12 w-full flex-row items-center justify-center gap-2 space-x-2"
						>
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
										}`}
									>
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
										}`}
									>
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
												openingTimes.open
													? `bg-dark-green`
													: ` bg-red-500`
											}`}
										></div>
										<p className="font-sans-reg text-sm">
											{currentMensa.url === undefined
												? ""
												: openingTimes.text}
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
					animate="show"
				>
					{food.foodOfferings?.map((offer, i) => {
						console.log(offer)
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

				{/* Bug Reporting Button */}

				{scrollPosition ? (
					<>
						<div className="fixed bottom-0 h-10 w-full px-3 py-2">
							<div className="m-auto grid max-w-xl grid-cols-2">
								<div className="flex flex-row space-x-2">
									<Link href="/impressum">
										<p className="text-sm opacity-50">
											Über Mensa-Radar
										</p>
									</Link>
								</div>
								{day === "samstag" ||
								day === "sonntag" ||
								food.foodOfferings?.length === 0 ? null : (
									<div
										className="flex cursor-pointer items-center space-x-1"
										onClick={() => openNutrientsFlow()}
									>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { mensa, day } = context.params

	// const sortedFoodOffers = foodOffers?.sort((a, b) => {
	// 	if (a.sold_out && !b.sold_out) {
	// 		return 1
	// 	}
	// 	if (!a.sold_out && b.sold_out) {
	// 		return -1
	// 	}
	// 	if (a.vegan && !b.vegan) {
	// 		return -1
	// 	}
	// 	if (!a.vegan && b.vegan) {
	// 		return 1
	// 	}
	// 	if (a.vegetarian && !b.vegetarian) {
	// 		return -1
	// 	}
	// 	if (!a.vegetarian && b.vegetarian) {
	// 		return 1
	// 	}
	// 	return 0
	// })

	const selectedWeekday = getWeekdayByName(day)
	let currentWeekday = new Date().getDay()
	currentWeekday = currentWeekday === 0 ? 6 : currentWeekday - 1
	let selectedDay = new Date()
	selectedDay.setDate(
		selectedDay.getDate() + (selectedWeekday - currentWeekday)
	)

	const connectionString = process.env.DATABASE_URL
	const client = postgres(connectionString)
	const smartDb = drizzle(client, { schema })
	const smartFood = await smartDb.query.mensen.findFirst({
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
				},
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

	// const food = await db
	// 	.select({
	// 		id: foodOfferings.id,
	// 		mensa: foodOfferings.mensa,
	// 		foodTitle: foodOfferings.foodTitle,
	// 		vegan: foodOfferings.vegan,
	// 		vegetarian: foodOfferings.vegetarian,
	// 		fish: foodOfferings.fish,
	// 		meat: foodOfferings.meat,
	// 		nutrients: foodOfferings.nutrients,
	// 		allergens: foodOfferings.allergens,
	// 		date: foodOfferings.date,
	// 		priceStudents: foodOfferings.priceStudents,
	// 		priceOther: foodOfferings.priceOther,
	// 		soldOut: foodOfferings.soldOut,
	// 		images: {
	// 			hasAiThumbnail: foodOfferings.hasAiThumbnail,
	// 			imageName: foodImages.imageName,
	// 			imageUrl: foodImages.imageUrl,
	// 		},
	// 		rating: {
	// 			rating: qualityReviews.rating,
	// 			userSessionId: qualityReviews.userSessionId,
	// 		},
	// 	})
	// 	.from(foodOfferings)
	// 	.leftJoin(foodImages, eq(foodOfferings.id, foodImages.id))
	// 	.leftJoin(qualityReviews, eq(foodOfferings.id, qualityReviews.id))
	// 	.innerJoin(mensen, eq(foodOfferings.mensa, mensen.id))
	// 	.where(
	// 		and(
	// 			eq(mensen.url, mensa.toString()),
	// 			eq(foodOfferings.date, selectedDay)
	// 		)
	// 	)

	const mensenList = await smartDb
		.select({
			name: mensen.name,
			url: mensen.url,
			location: {
				lat: mensen.locLat,
				long: mensen.locLong,
			},
			openingTimes: currentMensaData.openingTimes,
			enabled: currentMensaData.enabled,
		})
		.from(mensen)
		.innerJoin(currentMensaData, eq(mensen.id, currentMensaData.id))

	await client.end()

	return {
		props: {
			food: smartFood,
			// smartFood,
			mensenList: JSON.stringify(mensenList),
		},
	}
}
