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

	// const url = mensaData.url;
	// const mensaName = mensaData.name;

	// Switcher for Nutiotional Intformation is not yet working
	const [offers, setOffers] = useState([])
	
	const collapseNutrionionInfo = (index) => {
		let tempOffers = [...offers]
		let tempOffer = tempOffers[index]
		tempOffer = !tempOffer
		tempOffers[index] = tempOffer
		
		setOffers(tempOffers)
	}

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

	// Get Opening String from useOpeningString

	const [openingString, setOpeningString] = useState("")
	useEffect(() => {

	}, [])

    return (
		<div className="m-auto sm:max-w-3xl py-2 h-screen flex flex-col space-y-8">
			<Head>
				<title>{ mensaData.name } - Mensa Radar</title>
			</Head>
			<div className="px-4">
				<div className="w-full rounded-xl border-solid border  border-gray/20  flex flex-col space-y-3 py-3">
					<div className="flex justify-center space-x-2 items-center flex-row w-full">
						<h1 className="block text-h1 font-serif-bold">{mensaData.name}</h1>
						<img className="w-4 mt-0.5"
						src="/icons/chev-down.png"></img>
					</div>
					<div className="border-b border-gray/20"></div>

					<div className="flex justify-between items-center flex-row w-full px-4">
						<p className="decoration-2 text-black w-20 text-center font-sans-semi text-sm underline underline-offset-4">Heute</p>
						<Link href={'/mensa/'}>
							<div className="font-sans-bold text-sm inline-flex items-center flex-row space-x-1 text-gray/70">
							<p>Morgen</p>

							<img src="/icons/right-arrw.png" className="w-4 opacity-50"></img>
							</div>
						</Link>	
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
				<div className="w-full flex overflow-x-scroll overflow-auto  hide-scroll-bar ">
					<div className="flex flex-nowrap sm:flex-wrap space-x-2 snap-x snap-mandatory sm:space-x-0 sm:justify-between">
						{
							// Not sold out
						}
						{
							// Show Vegan first
							foodOffers?.map((offer, i) => {
								if(offer.vegan && !offer.sold_out){
									return (
										<Offer key={i} offer={offer} mensa={mensa} day={router.query.day}/>
									)
								}
							})
						}
						{
							// Show Vegetarian second
							foodOffers?.map((offer, i) => {
								if(offer.vegetarian && !offer.vegan && !offer.sold_out){
									return (
										<Offer key={i} offer={offer} mensa={mensa} day={router.query.day}/>
									)
								}
							})
						}
						{
							// Show rest later
							foodOffers?.map((offer, i) => {
								if(!offer.vegan && !offer.vegetarian && !offer.sold_out){
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