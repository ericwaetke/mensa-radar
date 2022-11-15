import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router'
import 'tailwindcss/tailwind.css'

import { getWeekdayByName } from '../../../../lib/getWeekdayByName';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { DayButton } from '../../../../components/dayButton';
import { Offer } from '../../../../components/offer';
import Head from 'next/head';
import { PillOnWhiteBG } from '../../../../components/pill';
import { getDates, getTempOpeningString } from '../../../../lib/getOpeningString';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../../../lib/getSupabaseClient';
import { GetStaticPaths } from 'next';
import { NutrientOverview } from '../../../../components/nutrients/nutrientOverview';



export default function Mensa(
	{
		foodOffers,
		selectedWeekday,
		mensaData = {},
	} : {
		foodOffers: {
			id: number,
			mensa: number,
			food_title: string,
			food_desc: string,
			vegan: boolean,
			vegetarian: boolean,
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
		}[],
		selectedWeekday: number,
		mensaData: any,
	}
) {

	const router = useRouter()
  	const { mensa, day } = router.query


	const containerAnimation = {
		hidden: {
			opacity: 0,
		},
		show: {
			opacity: 1,
			transition: {
				staggerChildren: .2,
				delayChildren: .1
			}
		}
	}
	const dayVariantAnimation = {
		hidden: {
			opacity: 0,
			y: 20
		},
		show: {
			opacity: 1,
			y: 0,
		}
	}

	const anim01 = {
		hidden: {
			opacity: 0,
		},
		show: {
			opacity: 1,
			transition: {
				staggerChildren: .1,
				delayChildren: 1
			}
		}
	}

	// get current weekday
	const [currentWeekday, setCurrentWeekday] = useState(new Date().getDay()-1);
	const days = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'];

	return (
		<div className="m-auto sm:max-w-3xl my-4 h-screen flex flex-col space-y-4">
			<Head>
				<title>{ mensaData.name } - Mensa Radar</title>
			</Head>
			<div className="px-4">
				<div className="w-full rounded-xl border-solid border  border-gray/20  flex flex-col space-y-3 py-3 sm:max-w-md m-auto">
					<div className="flex justify-center space-x-1 items-center flex-row w-full">
						<h1 className="block text-h1 font-serif-bold">{mensaData.name}</h1>
						<img className="w-4 mt-0.5"
						src="/icons/chev-down.svg"></img>
					</div>
					<div className="border-b border-gray/20"></div>

					<div className="flex items-center justify-between flex-row w-full px-4">
						{
							selectedWeekday > 0 ? <>
							<Link href={`/mensa/${mensa}/${days[selectedWeekday-1]}`}>
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
								<Link href={`/mensa/${mensa}/${days[selectedWeekday+1]}`}>
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
						<div className="w-2 h-2 bg-dark-green rounded-full"></div>
						<p className="text-gray/70 font-sans-med text-sm">{ mensaData.url === undefined ? "" : mensaData.openingString }</p>
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

			<div className="flex flex-col w-full sm:px-4">

					<div className="flex flex-nowrap sm:flex-wrap space-x-2 snap-mandatory snap-x sm:space-x-0 sm:justify-between overflow-x-scroll hide-scroll-bar sm:gap-y-4">
						{
							// Not sold out
						}
						
						{
							// Show rest later
							foodOffers?.map((offer, i) => {
								if(!offer.sold_out){
									return (
										<Offer key={i} offer={offer} mensa={mensa} day={router.query.day}/>
									)
								}
							})
						}

						{
							// Sold out
						}
						{
							foodOffers?.map((offer, i) => {
								if(offer.sold_out){
									return (
										<Offer key={i} offer={offer} mensa={mensa} day={router.query.day}/>
									)
								}
							})
						}
					</div>

			</div>
			
			{/* NÄHRWERTE */}

			<div className="space-y-4 flex flex-col">
				
				<div className="border-y border-gray/20">
					<div 
						className="flex py-6 justify-center items-center text-xl cursor-pointer px-8">
						<img src="/icons/right-arrw.svg" className="rotate-180 mr-auto w-4" />	
						<h2 className="font-sans-bold">
							Nährwerte
						</h2>
						<div className="ml-auto"></div>
					</div>
				</div>
				<div className="flex flex-col divide-y divide-gray/20 border-b border-gray/20">
					<div className="flex space-x-4 flex-row w-full font-serif-med text-sm py-2 px-4">
						<p className="w-2/12"></p>
						<p className="w-5/12">Kartoffel-Gemüse-Pfanne mit Rote-Bete-Dip</p>
						<p className="w-5/12">Kartoffel-Gemüse-Pfanne mit Räuchertofu…</p>
					</div>
					<div className="flex space-x-4 flex-row w-full items-center justify-between text-sm py-3 px-4">
						<p className="w-2/12 font-sans-bold">Kalorien</p>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
					</div>
					<div className="flex space-x-4 flex-row w-full items-center justify-between text-sm py-3 px-4">
						<p className="w-2/12 font-sans-bold">Kalorien</p>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
					</div>
					<div className="flex space-x-4 flex-row w-full items-center justify-between text-sm py-3 px-4">
						<p className="w-2/12 font-sans-bold">Kalorien</p>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
					</div>
					<div className="flex space-x-4 flex-row w-full items-center justify-between text-sm py-3 px-4">
						<p className="w-2/12 font-sans-bold">Kalorien</p>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
					</div>
				</div>
				<div className="flex flex-col divide-y divide-gray/20">
					<div className="flex space-x-4 flex-row w-full font-serif-med text-sm py-2 px-4">
						<p className="w-2/12"></p>
						<p className="w-5/12">Kartoffel-Gemüse-Pfanne mit Rote-Bete-Dip</p>
						<p className="w-5/12">Kartoffel-Gemüse-Pfanne mit Räuchertofu…</p>
					</div>
					<div className="flex space-x-4 flex-row w-full items-center justify-between text-sm py-3 px-4">
						<p className="w-2/12 font-sans-bold">Kalorien</p>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
					</div>
					<div className="flex space-x-4 flex-row w-full items-center justify-between text-sm py-3 px-4">
						<p className="w-2/12 font-sans-bold">Kohlenhydr.</p>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
					</div>
					<div className="flex space-x-4 flex-row w-full items-center justify-between text-sm py-3 px-4">
						<p className="w-2/12 font-sans-bold">Eiweiß</p>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
					</div>
					<div className="flex space-x-4 flex-row w-full items-center justify-between text-sm py-3 px-4">
						<p className="w-2/12 font-sans-bold">Fett</p>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
						<div className="w-5/12 flex flex-col space-y-1">
							<p className="w-5/12 font-sans-med">250,5g</p>
							<div className="rounded-full w-full h-2 bg-main-green"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
	const {data: mensaData} = await supabase
		.from("mensen")
		.select('url')
	
	const days = ["montag", "dienstag", "mittwoch", "donnerstag", "freitag", "samstag"]

	let paths = [];
	mensaData.map(mensa => {
		days.map(day => {
			paths.push({
				params: {
					mensa: mensa.url,
					day: day
				},
			})
		})
	})

	return {
		paths,
		fallback: false
	}
}



export async function getStaticProps(context) {
	const { params } = context
	const { mensa, day } = params
	
	const selectedWeekday = getWeekdayByName(day)

	const dev = process.env.NODE_ENV !== 'production';
	const getMensaDataReq = await fetch(`${dev ? 'http://localhost:3000' : 'https://next.mensa-radar.de'}/api/getMensaData`, {
		method: 'POST',
		body: JSON.stringify({
			selectedWeekday,
			mensa
		}),
	})
	const {
		foodOffers,
	} = await getMensaDataReq.json()

	const windowWidth = 1200	
		// window.innerWidth >= 1200 ? 1000 : window.innerWidth >= 800 ? 800 : 600

	// Get Images to the food offers
	const foodOffersWithImages = await Promise.all(foodOffers.map(async (offer) => {
		const {data: images} = await supabase
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
			return `${dev ? 'http://localhost:3000' : 'https://next.mensa-radar.de'}/api/image/?${params.toString()}`
		}

		const imageUrls = images.map(image => generateUrls(image.image_name))

		return {
			...offer,
			imageUrls
		}
	}))

	const { data: mensen, error: mensenError } = await supabase
		.from('mensen')
		.select()

	const { data: currentMensaData, error: currentMensaDataError } = await supabase
		.from('current_mensa_data')
		.select()

	const thisMensa = mensen.find(m => m.url === mensa)
	const currentMensa = currentMensaData.find(m => m.mensa === thisMensa.id)
	const thisMensaData = {
		...thisMensa,
		...currentMensa,
		openingString: await getTempOpeningString(currentMensa)
	}

	return {
		props: {
			foodOffers: foodOffersWithImages,
			mensaData: thisMensaData,
			selectedWeekday
		},
		revalidate: 60
	}
}