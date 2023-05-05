import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';

import { getWeekdayByName } from '../../../../lib/getWeekdayByName';

import Head from 'next/head';
import Link from 'next/link';
import Modal from "react-modal";
import { NutrientOverview } from '../../../../components/nutrients/nutrientOverview';
import { Pill } from '../../../../components/pill';
import { SelectMensa } from '../../../../components/SelectMensa';
import { getOpeningTimes } from '../../../../lib/getOpeningString';
import { supabase } from '../../../../lib/getSupabaseClient';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { usePlausible } from 'next-plausible';
import dynamic from 'next/dynamic';
import { NoFood } from '../../../../components/errors/NoFood';
import useScrollPosition from '../../../../hooks/useScrollPosition';
import { env } from '../../../../env.mjs';
import dayjs from 'dayjs';

const DynamicOffer = dynamic<{
  offer: {
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
  },
  mensa: string | string[],
  day: string | string[],
  triggerAiThumbnailRegeneration: (foodId: number, foodTitle: string) => void
  aiThumbnailBase64: string,
  	}>(() => import('../../../../components/offer/offer').then(mod => mod.Offer), {
  		loading: () => <p>Loading...</p>,
  	})

export const runtime = "experimental-edge"

export default function Mensa(
	{
		currentMensa,
		mensaList,
		foodOffers
	}: {
    currentMensa: MensaData,
    mensaList: MensaList,
    foodOffers: FoodOffering[]
  }
): JSX.Element {

	const router = useRouter()
	const { mensa, day } = router.query !== undefined ? router.query : { mensa: currentMensa.name, day: "freitag" };
	const [openingTimes, setOpeningTimes] = useState<{ open: boolean, text: string }>({ open: false, text: "" });

	const [path, setPath] = useState(router.asPath.split("#"))

	useEffect(() => {
		setModalOpen(false);
	}, [mensa, day]);

	// get current weekday
	const selectedWeekday = getWeekdayByName(day);

	// Subtracting one to start with monday
	const currentWeekday = new Date().getDate() - ((new Date().getDay() + 6) % 7) - 1;
	const days = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'];

	const [modalOpen, setModalOpen] = useState(false);
	const [currentModalContent, setCurrentModalContent] = useState("");
	const plausible = usePlausible()

	const openNutrientsFlow = () => {
		setCurrentModalContent("nutrients");
		setModalOpen(true);
		plausible("View Nutrients")
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
			top: '-8px',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, 0)',
			border: "none",
			background: "none",
		},
	};

	const scrollPosition = useScrollPosition(50);

	function uploadBase64toSupabase(base64: string, foodId: number) {
		if (base64 !== "" && base64 !== undefined && foodId) {
			fetch(`${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://mensa-radar.de"}/api/ai/uploadThumbnail/`,
				{
					method: "POST",
					body: JSON.stringify(
						{
							foodId: foodId,
							base64: base64
						}
					)
				}
			)
		}
	}
	const [generatedThumbnails, setGeneratedThumbnails] = useState(new Map<number, string>());
	async function queueThumbnailGeneration() {
		for await (const offer of foodOffers as FoodOffering[]) {
			if (offer.imageUrls.length === 0 && !offer.has_ai_thumbnail && !offer.sold_out) {
				console.log("Starting Generation")
				await aiThumbnailGeneration(offer.id, offer.food_title)
			}
		}
	}
	async function aiThumbnailGeneration(foodId: number, foodTitle: string) {
		console.log("Generating AI Thumbnail")
		return await fetch(`${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://mensa-radar.de"}/api/ai/generateThumbnail/`,
			{
				method: "POST",
				body: JSON.stringify(
					{
						foodId: foodId,
						foodTitle: foodTitle
					}
				)
			}
		)
			.then(res => res.json())
			.then(res => {
				console.log(res)
				if (res.message === "success") {
					uploadBase64toSupabase(res.base64, foodId);
					setGeneratedThumbnails(new Map(generatedThumbnails.set(foodId, res.base64)));
				}
			})
			.catch(err => console.log(err))
	}

	useEffect(() => {
		setModalOpen(false);
		setOpeningTimes(getOpeningTimes(currentMensa))
		queueThumbnailGeneration();
		// Update the Opening Times every minute
		const interval = setInterval(() => {
			setOpeningTimes(getOpeningTimes(currentMensa));
		}, 60 * 1000);

		return () => clearInterval(interval);
	}, [router.asPath])

	const getFoodDataById = (id: string): FoodOffering => {
		return foodOffers.find((foodOffer: FoodOffering) => foodOffer.id === parseInt(id))
	}

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
							mensen={mensaList} />
					</>
				}
			</Modal>
			<div className="mx-auto flex flex-col">
				{
					path[1] ?
						<>
							<Head>
								<meta property="og:url" content={`https://mensa-radar.de${path[0]}`} /> :
								<meta property="og:url" content={`https://mensa-radar.de${path[0]}#${path[1]}`} />
								<meta property="og:image" content={`${process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "https://mensa-radar.de/"}api/og/singleMeal?id=${path[1]}`} />
								<title>{getFoodDataById(path[1]).food_title} - Mensa Radar</title>
							</Head>
						</> : <>
							<Head>
								<title>{currentMensa.name} - Mensa Radar</title>
							</Head>
						</>
				}

				<div className={`fixed p-3 ${modalOpen ? null : "z-10"} w-full border-b border-gray/10 bg-light-green`}>
					<div className="m-auto w-full divide-y divide-gray/20 rounded-xl border border-solid border-gray/20 sm:max-w-xl">
						<div onClick={() => openMensaSelectionFlow()} className="flex h-12 w-full flex-row items-center justify-center space-x-1">
							<h1 className="text-h1 block font-serif-bold">{currentMensa.name}</h1>
							<img className="mt-0.5 w-4" src="/icons/chev-down.svg"></img>
						</div>
						<div className="flex h-10 w-full flex-row items-center justify-between px-4">
							{
								selectedWeekday > 0 ? <>
									<Link href={`/mensa/${mensa}/${days[selectedWeekday - 1]}`}>
										<a className='inline-flex grow basis-0 flex-row items-center space-x-1 font-sans-med text-sm'>
											<img src="/icons/right-arrw.svg" className="w-4 rotate-180 opacity-50" />

											<p className='capitalize'>
												{currentWeekday === selectedWeekday ? 'Gestern' : currentWeekday === selectedWeekday - 1 ? 'Heute' : days[selectedWeekday - 1]}
											</p>
										</a>
									</Link>
								</> : <div className='mr-auto w-20 grow basis-0 text-left font-sans-bold text-sm'></div>

							}
							<p className="font-sans-semi text-sm capitalize">
								{
									currentWeekday === selectedWeekday ? 'Heute' : selectedWeekday === currentWeekday + 1 ? 'Morgen' : selectedWeekday === currentWeekday - 1 ? 'Gestern' : days[selectedWeekday]
								}
							</p>
							{
								selectedWeekday < 4 ? <>
									<Link href={`/mensa/${mensa}/${days[selectedWeekday + 1]}`}>
										<a className="inline-flex grow basis-0 flex-row items-center space-x-1 text-right font-sans-med text-sm">
											<p className='w-full capitalize'>
												{currentWeekday === selectedWeekday ? 'Morgen' : currentWeekday === selectedWeekday + 1 ? "Heute" : days[selectedWeekday + 1]}
											</p>

											<img src="/icons/right-arrw.svg" className="w-4 opacity-50" />
										</a>
									</Link>
								</> : <div className='mr-auto w-20 grow basis-0 text-left font-sans-bold text-sm text-black'></div>
							}
						</div>
						{
							scrollPosition ? <>
								<div className="flex h-10 w-full flex-row items-center justify-center px-4 text-gray/70">
									<Pill col={"transparent"}>
										<div className={`mr-1 h-2 w-2 rounded-full ${openingTimes.open ? `bg-dark-green` : ` bg-red-500`}`}></div>
										<p className="font-sans-reg text-sm">{currentMensa.url === undefined ? "" : openingTimes.text}</p>
									</Pill>
								</div>
							</> : null
						}
					</div>
				</div>
				{
					day
				}
				{
					day === "samstag" || day === "sonntag" ? (
						<div className='flex h-screen w-full items-center justify-center'>
							<NoFood mainMessage="Ab Montag gibt&apos;s hier wieder Essen!" />
						</div>
					) : foodOffers?.length === 0 ? (
						<div className='flex h-screen w-full items-center justify-center'>
							<NoFood mainMessage="Bald gibt&apos;s hier wieder Essen!" />
						</div>
					) : null
				}

				<div className="hide-scroll-bar flex w-full snap-y snap-proximity flex-col overflow-y-scroll px-3 pb-16 pt-32">
					{
						// Show rest later
						foodOffers?.map((offer, i) => {
							return (
								<DynamicOffer key={offer.id} offer={offer} mensa={mensa} day={router.query.day} aiThumbnailBase64={generatedThumbnails.get(offer.id)} triggerAiThumbnailRegeneration={aiThumbnailGeneration} />
							)
						})
					}
				</div>

				{
					scrollPosition ? <>
						<div className='fixed bottom-0 h-10 w-full border-t border-gray/10 bg-light-green px-3 py-2'>
							<div className="m-auto grid max-w-xl grid-cols-2">
								<div className="flex flex-row space-x-2">
									<Link href="/impressum">
										<p className='font-sans-semi text-sm opacity-50'>
                      Über Mensa-Radar
										</p>
									</Link>
								</div>
								{
									day === "samstag" || day === "sonntag" || foodOffers?.length === 0 ? null : (
										<div className='flex cursor-pointer items-center space-x-1' onClick={() => openNutrientsFlow()}>
											<p className='w-full text-right font-sans-semi text-sm'>
                        Nährwerte vgl.
											</p>
											<img src="/icons/right-arrw.svg" className="w-4" />
										</div>
									)
								}
							</div>
						</div>
					</> : null
				}

			</div>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { mensa, day } = context.params
	const { data: mensaData, error: mensenError } = await supabase
		.from('mensen')
		.select(`
			id,
			name,
			loc_lat,
			loc_long,
			url,
			current_mensa_data (
				openingTimes
				)
		`)
		.eq('url', mensa)

	const dateFormated = new Date().toISOString().split('T')[0]
	const { data: daysWithFoodUnfiltered, error: daysWithFoodUnfilteredError } = await supabase
		.from('food_offerings')
		.select('mensa, date')
		.gte('date', dateFormated)
		.eq('mensa', mensaData![0].id)

	const daysWithFood = Array.from(new Set(daysWithFoodUnfiltered!.map((day) => day.date)))

	const currentMensa = {
		...mensaData![0],
		daysWithFood,
	}

	const selectedWeekday = getWeekdayByName(day)

	const dev = process.env.NODE_ENV !== 'production';
	const getMensaDataReq = await fetch(`${dev ? 'http://localhost:3000' : 'https://mensa-radar.de'}/api/getMensaData`, {
		method: 'POST',
		body: JSON.stringify({
			selectedWeekday,
			mensa
		}),
	})
	const { foodOffers }: { foodOffers: FoodOffering[] } = await getMensaDataReq.json()
	const sortedFoodOffers = foodOffers?.sort((a, b) => {
		if (a.sold_out && !b.sold_out) {
			return 1;
		}
		if (!a.sold_out && b.sold_out) {
			return -1;
		}
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


	const windowWidth = 1200
	// window.innerWidth >= 1200 ? 1000 : window.innerWidth >= 800 ? 800 : 600

	// Get Images to the food offers
	const combinedFoodOffers = await Promise.all(sortedFoodOffers.map(async (offer) => {
		const { data: images } = await supabase
			.from("food_images")
			.select('image_name')
			.eq('food_id', offer.id)


    images!.map(async image => {
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
    	return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/food-images/${imageName}?token=${env.NEXT_PUBLIC_SUPABASE_KEY}`
    }

    const imageUrls = images!.map(image => generateUrls(image.image_name))

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

	// Get List of all mensa's
	const { data: mensaList, error: mensaListError } = await supabase
		.from('mensen')
		.select(`
			id,
			name,
			loc_lat,
			loc_long,
			url,
			current_mensa_data (
				openingTimes
				)
		`)
		.order('name', { ascending: true })


	return {
		props: {
			currentMensa,
			foodOffers: combinedFoodOffers,
			mensaList,
		}
	}
}
