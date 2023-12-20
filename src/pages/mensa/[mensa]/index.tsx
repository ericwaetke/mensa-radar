/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { getWeekdayByName } from "../../../lib/getWeekdayByName"

import Head from "next/head"
import Link from "next/link"
import Modal from "react-modal"
import { SelectMensa } from "../../../components/SelectMensa"
import { NutrientOverview } from "../../../components/nutrients/nutrientOverview"
import { Pill } from "../../../components/pill"
import { getOpeningTimes } from "../../../lib/getOpeningString"
import { Offer } from "../../../components/offer/offer"

import { gt, asc, desc, eq, sql, gte } from "drizzle-orm"
import { drizzle } from "drizzle-orm/postgres-js"
import { motion } from "framer-motion"
import { GetServerSideProps } from "next"
import { usePlausible } from "next-plausible"
import Image from "next/image"
import postgres from "postgres"
import { BugReportButton } from "../../../components/bugReportButton"
import { NoFood } from "../../../components/errors/NoFood"
import useScrollPosition from "../../../hooks/useScrollPosition"
import {
	currentMensaData,
	foodOfferings,
	mensen,
} from "../../../server/dbSchema"

type DrizzleFoodQuery = {
	name: string
	url: string
	locLat: string
	locLong: string
	foodOfferings: NewFoodOffer[]
}

type DrizzleMensenQuery = EnhancedMensaList[]

export const runtime = "experimental-edge"

export default function Mensa({
	food,
	mensenListReq,
}: {
	food: DrizzleFoodQuery
	mensenListReq: string // JSON Stringified
}): JSX.Element {
	const router = useRouter()
	const { mensa } =
		router.query !== undefined ? router.query : { mensa: "Mensa not Found" }

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
	let [selectedMensa, setSelectedMensa] = useState({
		title: "Mensa not Found",
		description: "Mensa not Found",
		body: <></>,
	})
	useEffect(() => {
		const mensa = router.query.mensa
		if (mensa === undefined) return
		if (mensaInformation[mensa.toString()])
			setSelectedMensa(mensaInformation[mensa.toString()])
	}, [router.query])

	const mensaInformation: Record<
		string,
		{
			title: string
			description: string
			body: JSX.Element
		}
	> = {
		fhp: {
			title: "Mensa Kiepenheuerallee/Fachhochschule Potsdam",
			description:
				"Die Mensa Kiepenheuerallee ist auf dem Campus der Fachhochschule Potsdam",
			body: (
				<>
					<p>
						Auf dem Campus der Fachhochschule Potsdam gelegen, ist
						die Mensa Kiepenheuerallee als kulinarischer Knotenpunkt
						für Studierende und Besucher gleichermaßen.
					</p>
					<p>
						Die im Frühjahr 2009 eröffnete Mensa Kiepenheuerallee
						ist ein fester Bestandteil des wachsenden Campus der
						FHP. In zwei großzügigen Mensen und einer Cafeteria
						bietet die Mensa während des Semesters täglich ein Menü
						mit regionalen und internationalen Gerichten an. Durch
						die Verwendung saisonaler und regionaler Produkte trägt
						die Mensa zu einem nachhaltigen Speiseplan bei. Vegane
						Optionen sind an jedem Wochentag verfügbar, wobei der
						»Veggie-Wednesday« eine exklusive vegane und
						vegetarische Auswahl bietet. Entdecken Sie die Mensa
						Kiepenheuerallee für eine Vielzahl von Mahlzeiten und
						einen bequemen Essensstandort auf dem Campus der
						Fachhochschule Potsdam.
					</p>
				</>
			),
		},
		golm: {
			title: "Mensa Golm",
			description:
				"Die Mensa Golm ist auf dem Campus der Universität Potsdam",
			body: (
				<>
					<p>
						Die Mensa Golm, eingebettet zwischen Hörsälen und
						studentischen Wohnanlagen auf dem Campus der Universität
						Potsdam im Wissenschaftsstandort Golm, ist ein beliebter
						Anlaufpunkt für Studierende und Besucher. Das Gebäude
						ist durch einen umlaufenden Arkadengang komplett
						umschlossen, ermöglicht Mahlzeiten im Freien bei fast
						jedem Wetter und bietet auf zwei Ebenen ausreichend
						Platz. Eine großzügige Terrasse lädt dazu ein, das
						Mittagessen unter freiem Himmel zu genießen, besonders
						an warmen Tagen.
					</p>
					<p>
						Die Mensa Golm präsentiert ein vielfältiges
						Speisenangebot von Montag bis Freitag. Neben der
						Möglichkeit, täglich vegane Gerichte zu genießen, stehen
						jeden Mittwoch ausschließlich vegane und vegetarische
						Angebote auf dem Speiseplan. Entdecken Sie die
						entspannte Atmosphäre der Mensa Golm, erleben Sie
						kulinarische Vielfalt und genießen Sie eine angenehme
						Essensumgebung auf dem lebendigen Campus des
						Wissenschaftsstandorts Golm der Universität Potsdam.
					</p>
				</>
			),
		},
		filmuniversitaet: {
			title: "Mensa Filmuniversität Babelsberg KONRAD WOLF",
			description:
				"Die Mensa Filmuniversität Babelsberg KONRAD WOLF ist auf dem Campus der Filmuniversität Babelsberg KONRAD WOLF",
			body: (
				<>
					<p>
						Im neu eingeweihten Haus 6 öffnete die Mensa der
						Filmuniversität Babelsberg KONRAD WOLF erstmals im Mai
						2021 ihre Pforten. Mit 100 Plätzen im Innenbereich und
						weiteren 120 Plätzen auf einer großen wettergeschützten
						Außenterrasse bietet die Mensa eine gemütliche
						Verpflegungsmöglichkeit für Studierende und Beschäftigte
						der Filmuniversität. Das kulinarische Konzept legt dabei
						besonderen Wert auf ein vielfältiges vegetarisch-veganes
						Angebot. Genießen Sie hausgemachte Spezialitäten wie
						Limonaden und erleben Sie live zubereitete Gerichte im
						offenen Küchenbereich.
					</p>
					<p>
						Übrigens: Am »Veggie Wednesday« stehen jeden Mittwoch
						exklusiv vegane und vegetarische Angebote auf dem
						Speiseplan. Tauchen Sie ein in die entspannte Atmosphäre
						der Mensa und lassen Sie sich von einer breiten Auswahl
						an hausgemachten Leckereien verwöhnen.
					</p>
				</>
			),
		},
		"neues-palais": {
			title: "Mensa Am Neuen Palais",
			description:
				"Die Mensa Am Neuen Palais ist auf dem Campus der Universität Potsdam",
			body: (
				<>
					<p>
						Im nördlichen Teil des Schlossparks Sanssouci finden Sie
						unsere Mensa »Am Neuen Palais«. Das historische
						Wirtschaftsgebäude, das die zweigeschossige Mensa
						beherbergt, vermittelt einen Hauch des prachtvollen
						UNESCO-Weltkulturerbes. Der Innenhof der Mensa bietet
						zahlreiche Außenplätze, die in angenehmer Atmosphäre zum
						Verweilen einladen.
					</p>
					<p>
						Die Mensa »Am Neuen Palais« bietet von Montag bis
						Freitag ein vielfältiges Speisenangebot, darunter auch
						vegane Optionen. Besonders hervorzuheben ist der »Veggie
						Wednesday«, an dem ausschließlich vegane und
						vegetarische Köstlichkeiten auf dem Speiseplan stehen.
						Erleben Sie kulinarischen Genuss inmitten historischer
						Pracht und entspannen Sie im einzigartigen Ambiente der
						Mensa »Am Neuen Palais«.
					</p>
				</>
			),
		},
		griebnitzsee: {
			title: "Mensa Griebnitzsee",
			description:
				"Die Mensa Griebnitzsee ist auf dem Campus der Universität Potsdam",
			body: (
				<>
					<p>
						Zentral am Bahnhof Griebnitzsee gelegen, verbindet die
						Mensa Griebnitzsee die drei Hochschulstandorte der
						Universität Potsdam durch eine tägliche Zugverbindung.
						Diese Mensa zeichnet sich als eine der größten aus und
						bietet neben ihrem vielfältigen Speisenangebot eine
						besondere Nudelbar. Die Kaffeebar »Die Bohne« befindet
						sich nur wenige Schritte weiter im Foyer von Haus 6 und
						lockt mit verschiedenen Kaffeespezialitäten und Snacks.
					</p>
				</>
			),
		},
		wildau: {
			title: "Mensa Wildau/Technische Hochschule Wildau",
			description:
				"Die Mensa Wildau ist auf dem Campus der Technischen Hochschule Wildau",
			body: (
				<>
					<p>
						Erleben Sie modernes Essen in historischen Mauern in
						unserer zweigeschossigen Mensa, einst eine Werkhalle,
						auf dem angenehm gestalteten Campus der Technischen
						Hochschule Wildau. Das historische Ambiente bildet den
						perfekten Rahmen für täglich frisch zubereitete
						Gerichte. Neben der Mensa befinden sich die Cafeteria
						und die Kaffeebar »HaSi«, die gemeinsam einen belebten
						Treffpunkt auf dem Campus bilden und nur wenige Meter
						vom S-Bahnhof Wildau entfernt liegen.
					</p>
					<p>
						Die Mensa Wildau setzt auf gastronomische Vielfalt und
						bietet von Montag bis Freitag eine Auswahl an veganen
						Gerichten. Der »Veggie-Wednesday« präsentiert dabei
						exklusiv vegane und vegetarische Optionen. Genießen Sie
						eine zeitgemäße Kulinarik in historischer Kulisse und
						lassen Sie sich von unserem vielfältigen Speiseangebot
						auf dem Campus der Technischen Hochschule Wildau
						begeistern.
					</p>
				</>
			),
		},
		brandenburg: {
			title: "Mensa Brandenburg/Technische Hochschule Brandenburg",
			description:
				"Die Mensa Brandenburg ist auf dem Campus der Technischen Hochschule Brandenburg",
			body: (
				<>
					<p>
						Direkt auf dem Campus der Technischen Hochschule
						Brandenburg und in unmittelbarer Nähe unserer
						studentischen Wohnanlage Zanderstraße befindet sich die
						Mensa Brandenburg. Inmitten des Semesters präsentieren
						wir täglich eine Auswahl an regionalen und
						internationalen Gerichten. Die Cafeteria, räumlich von
						der Mensa getrennt und im Erdgeschoss gelegen, bietet
						eine Auswahl an Snacks, Heißgetränken und einer
						wechselnden Tagessuppe.
					</p>
					<p>
						Die Mensa Brandenburg steht im Zeichen kulinarischer
						Vielfalt und bietet von Montag bis Freitag auch vegane
						Speisen an. Besonders hervorzuheben ist der »Veggie
						Wednesday«, an dem ausschließlich vegane und
						vegetarische Köstlichkeiten auf dem Speiseplan stehen.
						Entdecken Sie die entspannte Atmosphäre der Mensa
						Brandenburg, Ihr gastronomischer Treffpunkt auf dem
						Campus der Technischen Hochschule Brandenburg.
					</p>
				</>
			),
		},
	} as const

	const mensenList: DrizzleMensenQuery = JSON.parse(mensenListReq)
	const currentMensa = mensenList.find((m) => m.url === mensa)

	const [mensaOpen, setMensaOpen] = useState(false)
	const [mensaOpenText, setMensaOpenText] = useState(
		"Öffnungszeiten werden geladen"
	)

	useEffect(() => {
		setModalOpen(false)
	}, [mensa])

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

	const [generatedThumbnails, setGeneratedThumbnails] = useState(
		new Map<number, string>()
	)

	async function queueThumbnailGeneration() {
		console.log("Queueing Thumbnail Generation")
		for (let i = 0; i < food.foodOfferings.length; i++) {
			const offer = food.foodOfferings[i]
			if (
				offer.foodImages.length === 0 &&
				!offer.hasAiThumbnail &&
				!offer.soldOut &&
				offer.priceOther !== 0 &&
				offer.priceStudents !== 0
			) {
				console.log(
					"Queueing Thumbnail Generation for",
					offer.foodTitleEn
				)
				await fetch(`/ai/prompt`, {
					method: "POST",
					body: JSON.stringify({
						food_id: offer.id,
						prompt: offer.foodTitleEn,
					}),
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Content-Type": "application/json",
					},
				})
					.then(async (res) => {
						// if (res.status === 201) refetchImage(offer.id)
					})
					.catch((err) => console.log(err))
			}
		}
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
	const url = new URL("https://mensa-radar.de" + router.asPath)
	const searchParams = new URLSearchParams(url.search)

	const day = searchParams.get("day") || weekday[currentWeekday]
	const days = ["montag", "dienstag", "mittwoch", "donnerstag", "freitag"]

	const selectedWeekday = getWeekdayByName(day)

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
					<title>{selectedMensa.title} – Mensa Radar</title>
					<meta
						name="description"
						content={`Speiseplan der ${selectedMensa.title} – schaue dir die aktuellen Essens-Angebote der Mensa mit Bildern von Nutzenden oder AI-Bildern, um schon vorher zu wissen, was du essen möchtest!`}
					/>
					<meta property="twitter:domain" content="mensa-radar.de" />
					<meta
						property="og:url"
						content={`https://mensa-radar.de/mensa/` + mensa}
					/>
					<meta
						property="twitter:url"
						content={`https://mensa-radar.de/mensa/` + mensa}
					/>
					<meta
						property="og:title"
						content={`${selectedMensa.title} - Mensa Radar`}
					/>
					<meta property="og:site_name" content="Mensa Radar" />
					<meta
						property="og:description"
						content={selectedMensa.description}
					/>
					<meta
						name="twitter:description"
						content={selectedMensa.description}
					/>
					<meta property="og:type" content="website" />
					<meta property="og:locale" content="de_DE" />
				</Head>

				<div className="hidden">
					<h1 className="text-h1 block font-serif-bold">
						Über {selectedMensa.title}
					</h1>
					{selectedMensa.body}
				</div>

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
										href={`/mensa/${mensa}?day=${
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
										href={`/mensa/${mensa}?day=${
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
					className="hide-scroll-bar flex w-full snap-y snap-proximity flex-col gap-4 overflow-y-scroll px-3 pt-36"
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

import * as schema from "../../../server/dbSchema"

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { mensa, day } = context.query
	console.log("SERVER CODE: ", mensa, day)

	let currentWeekday = new Date().getDay()
	currentWeekday = currentWeekday === 0 ? 6 : currentWeekday - 1
	let selectedWeekday
	if (day === undefined) {
		selectedWeekday = currentWeekday
	} else {
		selectedWeekday = getWeekdayByName(day)
	}
	let selectedDay = new Date()
	selectedDay.setDate(
		selectedDay.getDate() + (selectedWeekday - currentWeekday)
	)
	console.log("Selected Day: ", selectedDay)

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
					foodTitleEn: true,
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
		// .where(gte(foodOfferings.date, sql`current_date`))
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
