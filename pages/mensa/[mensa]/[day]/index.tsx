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
		foodOffers: any,
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
		<div className="space-y-6 break-words mx-5 mt-12 lg:w-1/2 lg:mx-auto">
			<Head>
				<title>{ mensaData.name } - Mensa Radar</title>
			</Head>
			<style jsx>
				{`
					.daySelection{
						position: relative;
					}
					.daySelection::before{
						content: "";
						position: absolute;
						right: 0;
						width: 20%;
						height: 100%;
						background: linear-gradient(270deg, #fff, transparent);
						pointer-events: none;
					}
					.open {
						transition: .3s;
						transform: rotate(180deg)
					}
					.closed {
						transition: .3s;
						transform: rotate(0);
					}
					.ReactCollapse--collapse {
						transition: height 500ms;
						}
				`}
			</style>

			<div>
				<Link href="/">
					<a className="p-2 pl-0 flex items-center gap-4">
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M11.1426 6.75C11.5568 6.75 11.8926 6.41421 11.8926 6C11.8926 5.58579 11.5568 5.25 11.1426 5.25V6.75ZM0.326533 5.46967C0.0336397 5.76256 0.0336397 6.23744 0.326533 6.53033L5.0995 11.3033C5.3924 11.5962 5.86727 11.5962 6.16016 11.3033C6.45306 11.0104 6.45306 10.5355 6.16016 10.2426L1.91752 6L6.16016 1.75736C6.45306 1.46447 6.45306 0.989592 6.16016 0.696699C5.86727 0.403806 5.3924 0.403806 5.0995 0.696699L0.326533 5.46967ZM11.1426 5.25L0.856863 5.25V6.75L11.1426 6.75V5.25Z" fill="black"/>
						</svg>
						<h2 className="text-lg font-bold text-center w-full">{ mensaData.name }</h2>
					</a>
				</Link>

			</div>

			<div className="flex justify-between">
				<PillOnWhiteBG>{ mensaData.url === undefined ? "" : mensaData.openingString }</PillOnWhiteBG>
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


			{/* Day Selection */}
			<div className="daySelection">
				<motion.div 
					className="space-x-4 flex overflow-x-scroll overflow-y-hidden"
					variants={containerAnimation}
					initial="hidden"
					animate="show">
					{
						getDates(new Date()).shownDays.map((day, i) => {
							let isSelected = selectedWeekday - (6 - getDates(new Date()).shownDays.length) === i
							
							return <motion.div variants={dayVariantAnimation}><DayButton mensa={mensa} day={day} isSelected={isSelected} router={router}/></motion.div>
						}) 
						
					} 
					
				</motion.div>
			</div>

			<motion.div variants={anim01} initial="hidden" animate="show" className='snap-both'>
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
			</motion.div>
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
		},
		revalidate: 60
	}
}