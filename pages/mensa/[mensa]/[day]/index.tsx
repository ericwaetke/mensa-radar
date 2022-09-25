import { useState } from 'react';
import { useRouter } from 'next/router'
import 'tailwindcss/tailwind.css'
import Footer from '../../../../components/footer';

import { getWeekdayByName } from '../../../../lib/getWeekdayByName';

import { mensaClearName } from '../../../../lib/mensaClearName';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { calculateAverage } from '../../../../lib/calculateAverage';
import { DayButton } from '../../../../components/dayButton';


export default function Mensa(
	{
		foodOffers = [],
		selectedWeekday = 0,
		days = [],
		openingTimes = {
			openFrom: "0:00",
			openUntil: "0:00",
			open: false
		}
	}: {
		foodOffers: any,
		selectedWeekday: number,
		days: string[],
		openingTimes: {
			openFrom: string,
			openUntil: string,
			open: boolean
		}
	}
) {

	const router = useRouter()
  	const { mensa } = router.query

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
	const anim02 = {
		hidden: {
			opacity: 0,
			y: 20
		},
		show: {
			opacity: 1,
			y: 0,
		}
	}


    return (
        <div className="space-y-6 break-words mx-5 mt-12 lg:w-1/2 lg:mx-auto">
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
					<a className="p-6 pl-0 flex items-center gap-4">
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M11.1426 6.75C11.5568 6.75 11.8926 6.41421 11.8926 6C11.8926 5.58579 11.5568 5.25 11.1426 5.25V6.75ZM0.326533 5.46967C0.0336397 5.76256 0.0336397 6.23744 0.326533 6.53033L5.0995 11.3033C5.3924 11.5962 5.86727 11.5962 6.16016 11.3033C6.45306 11.0104 6.45306 10.5355 6.16016 10.2426L1.91752 6L6.16016 1.75736C6.45306 1.46447 6.45306 0.989592 6.16016 0.696699C5.86727 0.403806 5.3924 0.403806 5.0995 0.696699L0.326533 5.46967ZM11.1426 5.25L0.856863 5.25V6.75L11.1426 6.75V5.25Z" fill="black"/>
						</svg>
						<h2 className="text-lg font-bold text-center w-full">{mensaClearName[mensa]}</h2>
					</a>
				</Link>

			</div>

			<div className="flex justify-between">
				{
					openingTimes.open ? 
					<>
						<div className="font-medium bg-main-white border border-main-black py-1.5 px-4 rounded-full inline-flex items-center gap-2">
							<span className="bg-sec-green-dark w-2 h-2 rounded-full"></span>
							offen bis {openingTimes.openUntil}
						</div>
					</> : 
					<>
						<div className="font-medium bg-custom-light-gray py-1.5 px-4 rounded-full">öffnet um {openingTimes.openFrom}</div>
					</>
				}

				{/* <div className='flex items-center gap-2'>
					<div className="font-medium bg-green-3 py-1.5 px-4 rounded-full text-green-w7">1.5km</div>
					<a href='#'>Route &rarr;</a>
				</div> */}
			</div>

			{/* Day Selection */}
			<div className="daySelection">
				<motion.div 
					className="space-x-4 flex overflow-x-scroll overflow-y-hidden"
					variants={containerAnimation}
					initial="hidden"
					animate="show">
					{
						days.map((day, i) => {
							let isSelected = selectedWeekday - (5 - days.length) === i
							return <motion.div variants={dayVariantAnimation}><DayButton mensa={mensa} day={day} isSelected={isSelected} router={router}/></motion.div>
						})
					}
				</motion.div>
			</div>

			<motion.div variants={anim01} initial="hidden" animate="show">
            {
				foodOffers.map((offer, i) => {
					return (
						<motion.div variants={anim02}>
							<Link href={`/mensa/${mensa}/${router.query.day}/${offer._id}`}>
								<a>
									<div className="my-4 p-5 flex gap-8 rounded-xl bg-background-container justify-between">
										{/* <p className="font-medium text-sm text-gray-400">{offer.titel}</p> */}
										<motion.div className='flex-initial w-full'
										variants={containerAnimation}
										initial="hidden"
										animate="show">
											<motion.p variants={dayVariantAnimation} className="text-2xl font-bold">{offer.beschreibung}</motion.p>
											<div className="mt-9 flex justify-between flex-col xs:flex-row items-start gap-y-2">
												<motion.p variants={dayVariantAnimation} className="font-medium text-gray-400 text-sm flex gap-2 items-center">
													<span className="bg-main-white rounded-full py-1 px-4 text-black inline-block">{offer.preise.preis_s} €</span>
													<span className='text-green-w7'>{offer.preise.preis_g} €</span>
												</motion.p>
												<motion.div variants={dayVariantAnimation} className='flex gap-2'>
													{offer.qualityRating && <p className="capitalize font-medium text-sm bg-main-white rounded-full py-1 px-4 flex items-center gap-1">
														<svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M9.55706 0.846068C9.74421 0.488621 10.2558 0.488621 10.443 0.846068L12.8792 5.49937C12.9497 5.6339 13.0774 5.72913 13.2265 5.75821L18.2594 6.73997C18.6417 6.81455 18.7957 7.27832 18.5339 7.56676L14.9933 11.4678C14.8954 11.5757 14.8494 11.721 14.8674 11.8656L15.5279 17.1685C15.5772 17.5637 15.1672 17.855 14.8102 17.6785L10.2216 15.4096C10.082 15.3405 9.91808 15.3405 9.7784 15.4096L5.18989 17.6785C4.8329 17.855 4.42287 17.5637 4.4721 17.1685L5.13267 11.8656C5.15068 11.721 5.1047 11.5757 5.00675 11.4678L1.46612 7.56676C1.20433 7.27832 1.35831 6.81455 1.74063 6.73997L6.77357 5.75821C6.92262 5.72913 7.05037 5.6339 7.12081 5.49937L9.55706 0.846068Z" fill="#161616"/>
														</svg>
														{calculateAverage(offer.qualityRating)}
														</p>}
													{offer.labels.filter !== "all" && <p className="capitalize font-medium text-sm bg-main-white rounded-full py-1 px-3 inline-block">{offer.labels.filter}</p>}
												</motion.div>
											</div>
										</motion.div>
										<div className='border-l pl-6 border-dashed border-main-black/80 flex items-center'>
											<svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M1 1.5L7 8L1 14.5" stroke="#161616" strokeWidth="2"/>
											</svg>
										</div>
									</div>
								</a>
							</Link>
						</motion.div>
					)
				})
			}
			</motion.div>
        </div>
    )
}

export function getStaticPaths() {
	

	let paths = [];
	// mensaData.map(mensa => {
	// 	days.map(day => {
	// 		paths.push({
	// 			params: {
	// 				mensa: mensa.url,
	// 				day: day.url
	// 			},
	// 		})
	// 	})
	// })

	return {
		paths,
		fallback: true
	}
}

export async function getStaticProps(context) {
	const { params } = context
	const { mensa, day } = params

	const selectedWeekday = getWeekdayByName(day)

	const dev = process.env.NODE_ENV !== 'production';
	const props = await fetch(`${dev ? 'http://localhost:3000' : 'https://mensa-radar.de'}/api/getMensaData`, {
		method: 'POST',
		body: JSON.stringify({
			selectedWeekday,
			mensa
		}),
	})

	return {
		props: await props.json(),
		revalidate: 60
	}
}