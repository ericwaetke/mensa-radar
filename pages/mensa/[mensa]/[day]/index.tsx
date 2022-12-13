import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import 'tailwindcss/tailwind.css';

import { getWeekdayByName } from '../../../../lib/getWeekdayByName';

import Head from 'next/head';
import Link from 'next/link';
import Modal from "react-modal";
import { NutrientOverview } from '../../../../components/nutrients/nutrientOverview';
import { Offer } from '../../../../components/offer';
import { SelectMensa } from '../../../../components/SelectMensa';
import { supabase } from '../../../../lib/getSupabaseClient';
import { getOpeningTimes } from '../../../../lib/getOpeningString';

export default function Mensa(
	{
		foodOffers,
		selectedWeekday,
		mensaData = {},
		mensen,
	}: {
		foodOffers: {
			id: number,
			mensa: number,
			food_title: string,
			food_desc: string,
			vegan: boolean,
			vegetarian: boolean,
			fish: boolean,
			meat: boolean,
			nutrients: {
				name: string,
				value: string,
				unit: string,
			}[],
			allergens: string[]
			date: string,
			price_students: number,
			price_other: number,
			sold_out: boolean,

			imageUrls: string[],
			ratings: {
				rating: number,
				userSessionId: string,
			}[]
		}[],
		selectedWeekday: number,
		mensaData: any,
		mensen: any,
	}
) {

	const sortedFoodOffers = useMemo(() => {
		// Show vegan first, then vegetarian, then everything else
		return foodOffers.sort((a, b) => {
			if (a.vegan && !b.vegan) {
				return -1;
			}
			if (!a.vegan && b.vegan) {
				return 1;
			}
			if (a.vegetarian && !b.vegetarian) {
				return -1;
			}
			if (!a.vegetarian && b.vegetarian) {
				return 1;
			}
			return 0;
		})
	}, [foodOffers]);

	const router = useRouter()
	const { mensa, day } = router.query
	const [openingTimes, setOpeningTimes] = useState<{open: boolean, text: string}>({open: false, text: ""});

	// get current weekday
	const [currentWeekday, setCurrentWeekday] = useState(0);
	const days = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'];

	const [modalOpen, setModalOpen] = useState(false);
	const [currentModalContent, setCurrentModalContent] = useState("");

	const openNutrientsFlow = () => {
		setCurrentModalContent("nutrients");
		setModalOpen(true);
	}
	const openMensaSelectionFlow = () => {
		setCurrentModalContent("mensaSelection");
		setModalOpen(true);
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
			padding: 0
		},
	};
	const resizedModal = {
		content: {
			top: '-4px',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, 0)',
			border: "none",
			background: "none",
		},
	};

	useEffect(() => {
		setCurrentWeekday(new Date().getDay() - 1)
		setOpeningTimes(mensaData.openingTimesObject)
		// Update the Opening Times every minute
		const interval = setInterval(() => {
			console.log("Updating opening times");
			setOpeningTimes(getOpeningTimes(mensaData, mensaData.daysWithFood));
		}, 60 * 1000);

		return () => clearInterval(interval);
	}, [])

	return (
		<>
			<Modal
				isOpen={modalOpen}
				onRequestClose={() => setModalOpen(false)}
				style={currentModalContent === "nutrients" ? fullsizeModal : resizedModal}
			>
				{
					currentModalContent === "nutrients" ? <>
						<NutrientOverview
							foodOffers={foodOffers}
							setModalOpen={setModalOpen} />
					</> : <>
						<SelectMensa
							setModalOpen={setModalOpen}

							currentMensa={mensa}
							mensen={mensen} />
					</>
				}
			</Modal>
			<div className="mx-auto flex flex-col py-2">
				<Head>
					<title>{mensaData.name} - Mensa Radar</title>
				</Head>
				<div className="px-3 pb-4">
					<div className="w-full rounded-xl border-solid border  border-gray/20  flex flex-col space-y-2.5 py-2.5 sm:max-w-xl m-auto">
						<div
							onClick={() => openMensaSelectionFlow()}
							className="flex justify-center space-x-1 items-center flex-row w-full">
							<h1 className="block text-h1 font-serif-bold">{mensaData.name}</h1>
							<img className="w-4 mt-0.5"
								src="/icons/chev-down.svg"></img>
						</div>
						<div className="border-b border-gray/20"></div>

						<div className="flex items-center justify-between flex-row w-full px-4">
							{
								selectedWeekday > 0 ? <>
									<Link href={`/mensa/${mensa}/${days[selectedWeekday - 1]}`}>
										<a className='font-sans-bold text-sm inline-flex items-center flex-row space-x-1 text-gray/70 grow basis-0'>
											<img src="/icons/right-arrw.svg" className="rotate-180 w-4 opacity-50" />

											<p className='capitalize'>
												{currentWeekday === selectedWeekday ? 'Gestern' : currentWeekday === selectedWeekday - 1 ? 'Heute' : days[selectedWeekday - 1]}
											</p>
										</a>
									</Link>
								</> : <div className='text-black w-20 text-left font-sans-bold text-sm mr-auto'></div>

							}
							<p className="decoration-2 text-black w-20 text-center font-sans-semi text-sm underline underline-offset-4 capitalize">
								{
									currentWeekday === selectedWeekday ? 'Heute' : selectedWeekday === currentWeekday + 1 ? 'Morgen' : selectedWeekday === currentWeekday - 1 ? 'Gestern' : days[selectedWeekday]
								}
							</p>
							{
								selectedWeekday < 4 ? <>
									<Link href={`/mensa/${mensa}/${days[selectedWeekday + 1]}`}>
										<a className="font-sans-bold text-sm inline-flex items-center flex-row space-x-1 text-gray/70 grow basis-0 text-right">
											<p className='capitalize w-full'>
												{currentWeekday === selectedWeekday ? 'Morgen' : currentWeekday === selectedWeekday + 1 ? "Heute" : days[selectedWeekday + 1]}
											</p>

											<img src="/icons/right-arrw.svg" className="w-4 opacity-50" />
										</a>
									</Link>
								</> : <div className='text-black w-20 text-left font-sans-bold text-sm mr-auto'></div>
							}
						</div>


						<div className="border-b border-gray/20"></div>
						<div className="flex justify-between items-center flex-row w-full px-4">
						<div className="flex space-x-2 items-center">
							<div className={`w-2 h-2 rounded-full ${openingTimes.open ? "bg-dark-green" : "bg-red-500"}`}></div>
							<p className="text-gray/70 font-sans-med text-sm">{ mensaData.url === undefined ? "" : openingTimes.text }</p>
						</div>
						</div>
					</div>
				</div>


				{
					day === "samstag" || day === "sonntag" ? (
						<div>
							<p>
								Heute hat die Mensa leider geschlossen. Möchtest du dir das Essen vom vergangenen Freitag anschauen?
							</p>
							<Link href={`/mensa/${mensa}/freitag`}>
								<a className="p-2 px-4 rounded-xl inline-flex items-center gap-4 border">
									Zu vergangenem Freitag
								</a>
							</Link>
						</div>
					) : null
				}

				<div className="flex flex-col w-full border-y border-gray/20 overflow-y-scroll snap-y snap-proximity hide-scroll-bar px-3 pb-4">
					{
						// Show rest later
						sortedFoodOffers?.map((offer, i) => {
							if (!offer.sold_out) {
								return (
									<Offer key={i} offer={offer} mensa={mensa} day={router.query.day} />
								)
							}
						})
					}
				</div>

				<div className='sticky top-full grid grid-cols-2 px-3 py-2'>
					<div className="flex flex-row space-x-2">
						<Link href="/impressum">
							<p className='font-sans-semi text-sm opacity-50'>
								Über Mensa-Radar
							</p>
						</Link>
					</div>
					<div className='flex space-x-1 cursor-pointer items-center' onClick={() => openNutrientsFlow()}>
						<p className='font-sans-semi text-sm text-right w-full'>
							Nährwerte vlg.
						</p>
						<img src="/icons/right-arrw.svg" className="w-4" />
					</div>
				</div>
			</div>
		</>
	)
}

export async function getServerSideProps(context) {
	const currentWeekday = new Date().getDay()-1
	const { params } = context
	const { mensa, day } = params

	const selectedWeekday = getWeekdayByName(day)

	const dev = process.env.NODE_ENV !== 'production';
	const getMensaDataReq = await fetch(`${dev ? 'http://localhost:3000' : 'https://mensa-radar.de'}/api/getMensaData`, {
		method: 'POST',
		body: JSON.stringify({
			selectedWeekday,
			mensa
		}),
	})
	const { foodOffers } = await getMensaDataReq.json()

	const windowWidth = 1200
	// window.innerWidth >= 1200 ? 1000 : window.innerWidth >= 800 ? 800 : 600

	// Get Images to the food offers
	const foodOffersWithAdditionalInfo = await Promise.all(foodOffers.map(async (offer) => {
		const { data: images } = await supabase
			.from("food_images")
			.select('image_name')
			.eq('food_id', offer.id)


		images.map(async image => {
			const { data, error } = await supabase
				.storage
				.from('food-images')
				.list('', {
					limit: 100,
					offset: 0,
					sortBy: { column: 'name', order: 'asc' },
					search: image.image_name
				})
		})

		const generateUrls = (imageName: string) => {
			const params = new URLSearchParams({
				f: imageName,
				b: "food-images",
				w: windowWidth.toString(),
				h: null,    // set to null to keep image's aspect ratio
				q: "80",
				token: process.env.NEXT_PUBLIC_SUPABASE_KEY
			})
			return `${dev ? 'http://localhost:3000' : 'https://mensa-radar.de'}/api/image/?${params.toString()}`
		}

		const imageUrls = images.map(image => generateUrls(image.image_name))

		const { data: ratings } = await supabase
			.from("quality_reviews")
			.select('rating, userSessionId')
			.eq('offerId', offer.id)

		return {
			...offer,
			ratings,
			imageUrls
		}
	}))

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

	const thisMensa = mensen.find(m => m.url === mensa)
	const currentMensa = currentMensaData.find(m => m.mensa === thisMensa.id)
	const daysWithFoodOfCurrentMensa = daysWithFoodUnfiltered.filter(d => d.mensa === thisMensa.id).map(d => d.date)
	const thisMensaData = {
		...thisMensa,
		...currentMensa,
		openingTimesObject: getOpeningTimes(currentMensa, daysWithFoodOfCurrentMensa),
		daysWithFood: daysWithFoodOfCurrentMensa
	}

	const mensaData = mensen.map(async mensa => {
		const currentMensa = currentMensaData.find((currentMensa) => currentMensa.mensa === mensa.id)

		// Filter days with food to mensaId and make date unique
		const daysWithFood = [...new Set(daysWithFoodUnfiltered.filter((day) => day.mensa === mensa.id).map((day) => day.date))]
		return {
			...mensa,
			...currentMensa,
			daysWithFood,
		}
	})

	const mensaDataResolved = await Promise.all(mensaData)

	return {
		props: {
			foodOffers: foodOffersWithAdditionalInfo,
			mensaData: thisMensaData,
			mensen: mensaDataResolved,
			selectedWeekday
		},
	}
}
