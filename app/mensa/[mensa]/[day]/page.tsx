import { useRouter } from 'next/navigation'
import 'tailwindcss/tailwind.css'
import Footer from '../../../../components/footer';

import { getWeekdayByName } from '../../../../lib/getWeekdayByName';

import Link from 'next/link';
import { DayButton } from '../../../../components/dayButton';
import { Offer } from '../../../../components/offer';
import Head from 'next/head';
import { Pill, PillOnWhiteBG } from '../../../../components/pill';
import { getDates } from '../../../../lib/getOpeningString';
import { createClient } from '@supabase/supabase-js';
import { use } from 'react';

import {headers} from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

const getFoodOffers = async (mensa: string | string[], day: string | string[]) => {
	const selectedWeekday = getWeekdayByName(day)

	const dev = process.env.NODE_ENV !== 'production';
	const props = await fetch(`${dev ? 'http://localhost:3000' : 'https://mensa-radar.de'}/api/getMensaData`, {
		method: 'POST',
		body: JSON.stringify({
			selectedWeekday,
			mensa
		}),
		next: {
			revalidate: 60*5
		}
	})
	return props.json()
}

const fetchData = async () => {
	const mensaDataReq = await supabase.from('mensen').select()
	return mensaDataReq.data
}

export default function Mensa({params}) {
	const {mensa, day} = params
	
	const { foodOffers, selectedWeekday }: { foodOffers: any[], selectedWeekday: number } = use(getFoodOffers(mensa, day))

	const mensaData = use(fetchData())

	const url = mensaData.filter(mensaFilter => mensaFilter.url === mensa)[0]?.url;

	const mensaName = mensaData.filter(mensaFilter => mensaFilter.url === mensa)[0]?.name;
	// Switcher for Nutiotional Intformation is not yet working

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

    return (
        <div className="space-y-6 break-words mx-5 mt-12 lg:w-1/2 lg:mx-auto">
			<Head>
				<title>{ mensaName } - Mensa Radar</title>
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
				<Link href="/" className="p-2 pl-0 flex items-center gap-4">
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M11.1426 6.75C11.5568 6.75 11.8926 6.41421 11.8926 6C11.8926 5.58579 11.5568 5.25 11.1426 5.25V6.75ZM0.326533 5.46967C0.0336397 5.76256 0.0336397 6.23744 0.326533 6.53033L5.0995 11.3033C5.3924 11.5962 5.86727 11.5962 6.16016 11.3033C6.45306 11.0104 6.45306 10.5355 6.16016 10.2426L1.91752 6L6.16016 1.75736C6.45306 1.46447 6.45306 0.989592 6.16016 0.696699C5.86727 0.403806 5.3924 0.403806 5.0995 0.696699L0.326533 5.46967ZM11.1426 5.25L0.856863 5.25V6.75L11.1426 6.75V5.25Z" fill="black"/>
						</svg>
						<h2 className="text-lg font-bold text-center w-full">{mensaName}</h2>
				</Link>

			</div>

			<div className="flex justify-between">
				<PillOnWhiteBG>{ url === undefined ? "" : "openingString" }</PillOnWhiteBG>
			</div>

			{
					// @ts-ignore
					day === "samstag" || day === "sonntag" ? (
						<div>
							<p>
							Heute hat die Mensa leider geschlossen. Möchtest du dir das Essen vom vergangenen Freitag anschauen?
							</p>
							<Link href={`/mensa/${mensa}/freitag`} className="p-2 px-4 rounded-xl inline-flex items-center gap-4 border">
									Zu vergangenem Freitag
							</Link>
						</div>
					) : null
			}


			{/* Day Selection */}
			<div className="daySelection">
				<div 
					className="space-x-4 flex overflow-x-scroll overflow-y-hidden"
					// variants={containerAnimation}
					// initial="hidden"
					// animate="show"
					>
					{
						getDates(new Date()).shownDays.map((day, i) => {
							let isSelected = selectedWeekday - (6 - getDates(new Date()).shownDays.length) === i
							
							return <div 
							// variants={dayVariantAnimation}
							>
								<Link href={`/mensa/${mensa}/${day.url}`} className={`${isSelected ? "bg-main-green" : "bg-background-container"} h-max px-8 py-4 inline-flex min-w-max flex-col items-start justify-center rounded-xl text-green-w7 uppercase`}>
									<p className={`font-bold ${isSelected ? 'text-black' : null}`}>{day.mainText}</p>
									{
										isSelected ? 
										<>
											<p className="text-sm">
												{day.subText}
											</p>
										</> : null
									}
								</Link>
							</div>
						}) 
					} 
					
				</div>
			</div>

			<div 
				// variants={anim01} 
				// initial="hidden" 
				// animate="show"
				>
			{
				// Not sold out
			}
            {
				// Show Vegan first
				foodOffers.map((offer, i) => {
					if(offer.labels.foodType === "vegan" && !offer.soldOut){
						return (
							<Offer key={i} offer={offer} mensa={mensa} day={day}/>
						)
					}
				})
			}
			{
				// Show Vegetarian second
				foodOffers.map((offer, i) => {
					if(offer.labels.foodType === "vegetarisch" && !offer.soldOut){
						return (
							<Offer key={i} offer={offer} mensa={mensa} day={day}/>
						)
					}
				})
			}
			{
				// Show rest later
				foodOffers.map((offer, i) => {
					if(offer.labels.foodType !== "vegan" && offer.labels.foodType !== "vegetarisch" && !offer.soldOut){
						return (
							<Offer key={i} offer={offer} mensa={mensa} day={day}/>
						)
					}
				})
			}

			{
				// Sold out
			}
			{
				foodOffers.map((offer, i) => {
					if(offer.soldOut){
						return (
							<Offer key={i} offer={offer} mensa={mensa} day={day}/>
						)
					}
				})
			}
			</div>
        </div>
    );
}
