import { motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"

import Modal from "react-modal"
Modal.setAppElement('#__next');
import { CaptureImage, CaptureImageHeader } from "./imageFlow/CaptureImage"
import RateFood, { RateFoodHeader } from "./ratings/RateFood"
import { Allergens } from "./allergens"
import { getSessionId } from "../lib/localStorageHelper"
import { BottomSheet } from "react-spring-bottom-sheet";
import 'react-spring-bottom-sheet/dist/style.css'

export const Offer = (
	{
		offer,
		
		mensa,
		day,
		reff
	}: {
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
		reff: any
	}
) => {
	
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

	const formatter = new Intl.NumberFormat('de-DE', {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: 2
	})

	const emojis = [
		"🤮",
		"😕",
		"😊",
		"😋"
	]
	const calculateAverageRating = (ratings: {rating: number, userSessionId: string}[]) => {
		let sum = 0;
		ratings.forEach(rating => {
			sum += rating.rating;
		})
		return (sum / ratings.length) * 100 || 0;
	}
	const averageRating = useMemo(() => calculateAverageRating(offer.ratings), [offer.ratings])
	const sessionId = useRef(getSessionId())

	const [hasUserRated, setHasUserRated] = useState(false)

	const [modalOpen, setModalOpen] = useState(false);
	const [currentModalContent, setCurrentModalContent] = useState("");

	const openImageFlow = () => {
		setCurrentModalContent("image");
		setModalOpen(true);
	}
	const openRatingFlow = () => {
		setCurrentModalContent("rating");
		setModalOpen(true);
	}

	const customStyles = {
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
	  
	const [tempImage, setTempImage] = useState("");


	useEffect(() => {
		setHasUserRated(offer.ratings.some(rating => rating.userSessionId === sessionId.current))
	}, [])

	return (
		<>
		<BottomSheet 
			open={modalOpen} 
			onDismiss={() => setModalOpen(false)}
			header={
				currentModalContent == "image" ? <>
					<CaptureImageHeader foodTitle={offer.food_title}/>
				</> : <>
					<RateFoodHeader foodTitle={offer.food_title}/>
				</>
			}>
				{
					currentModalContent == "image" ? <>
						<CaptureImage 
							setModalOpen={setModalOpen} 
							setCurrentModalContent={setCurrentModalContent}
							setTempImage={setTempImage} 
							
							foodTitle={offer.food_title}
							foodId={offer.id}/>
					</> : currentModalContent === "rating" ? <>
						<RateFood
							setModalOpen={setModalOpen}
							setCurrentModalContent={setCurrentModalContent}

							foodTitle={offer.food_title}
							foodId={offer.id}
							/>
					</> : <></>
				}
		</BottomSheet>
		<motion.div 
			className={`snap-start flex-row pt-4 sm:max-w-xl mx-auto`}
			variants={containerAnimation}
			initial="hidden"
			animate="show"
			>
				
			<div ref={reff} className={`rounded-2xl bg-white pt-3 flex flex-col justify-between ${offer.sold_out ? "opacity-50" : ""}`}>
				<div className="flex-col space-y-3  px-3 mb-auto">
				{
					offer.imageUrls.length > 0 || tempImage != "" ? <div className="w-full h-44 bg-gray rounded-xl">
						{
							tempImage !== "" ? <img src={tempImage} className="w-full h-full object-cover rounded-xl" /> : <img src={offer.imageUrls[offer.imageUrls.length-1]} className="w-full h-full object-cover rounded-xl" />
						} 
					</div> : 
					<div className="w-full h-44 bg-lightshiny-green rounded-xl flex justify-center items-center">
						{
							<div onClick={() => openImageFlow()} className="rounded-lg border border-gray/20 py-3 px-4 font-sans-med flex flex-row space-x-2 text-sm" >
								<img src="/icons/camera.svg" className="w-4"></img>
								<p>Foto hochladen</p>
							</div>
						}
					</div>
				}
					
					<h2 className="text-h2 font-serif-semi px-4 pt-2">
						{offer.food_title}
					</h2>

					<Allergens allergens={offer.allergens}/>
				</div>
				<div className="flex flex-col space-y-4 text-sm">
					<div className="px-4 flex-col space-y-2">
						<div className="flex px-2 flex-row justify-between">
							<div className="inline-flex flex-row space-x-1.5 px-3 py-1 rounded-full font-sans-med  bg-light-green">
								<p>{formatter.format(offer.price_students)}</p>
								<p className="text-gray/50">·</p>
								<p className="text-gray/50">{formatter.format(offer.price_other)}</p>
							</div>
							{
								offer.vegan ? <>
									<div className="inline-flex flex-row space-x-1 px-3 pl-2 py-1 bg-main-green items-center rounded-full font-sans-med">
										<img src="/icons/vegan.svg" className="w-4"></img>
										<p>vegan</p>
									</div>
								</> : offer.vegetarian ? <>
									<div className="inline-flex flex-row space-x-1 px-3 pl-2 py-1 bg-main-green items-center rounded-full font-sans-med text-sm">
										<img src="/icons/vegan.svg" className="w-4"></img>
										<p>vegetarisch</p>
									</div>
								</> : offer.fish ? <>
									<div className="inline-flex flex-row space-x-1 px-3 pl-2 py-1 bg-indigo-300 items-center rounded-full font-sans-semi text-sm">
										<img src="/icons/allergene/Fisch.svg" className="w-4"></img>
										<p>Fisch</p>
									</div>
								</> : offer.meat ? <>
									<div className="inline-flex flex-row space-x-1 px-3 pl-2 py-1 bg-red-300 items-center rounded-full font-sans-semi text-sm">
										<img src="/icons/meat.svg" className="w-4"></img>
										<p>Fleisch</p>
									</div>
								</> : offer.sold_out? <>
									<div className="inline-flex flex-row space-x-1 px-3 pl-2 py-1 bg-main-green items-center rounded-full font-sans-semi text-sm">
										<p>😢</p>
										<p>Ausverkauft</p>
									</div>
								</> :
								null
							}
								{
									hasUserRated ? <>
										<div className="inline-flex flex-row space-x-1 px-3 py-1 rounded-full font-sans-semi text-sm bg-main-green">
											<p>
												Deine Bewertung: 
											</p>
											<p>
												{
													averageRating < 25 ? emojis[0] :
													averageRating < 50 ? emojis[1] :
													averageRating < 75 ? emojis[2] :
													emojis[3]
												}
											</p>
										</div>
									</> : null
								}	
						</div>
						{/* TODO: Rating */}
						
					</div>
					{
					offer.ratings.length !== 0 ? <>
						<div className="flex-row flex justify-between w-full px-6 border-t border-gray/20 h-14 items-center text-sm" onClick={() => openRatingFlow()}>
							<div className="flex-row  flex space-x-2 font-sans-semi">
								
								<p>
									{
									averageRating < 25 ? emojis[0] :
									averageRating < 50 ? emojis[1] :
									averageRating < 75 ? emojis[2] :
									emojis[3]
									}
								</p>
								<p>{
										averageRating/20
									} / 5</p>
								<p className=" font-sans-med text-gray/50">·</p>
								<p className="font-sans-med text-gray/50">{offer.ratings.length === 1 ? "1 Bewertung" : `${offer.ratings.length} Bewertungen`}</p>
								
								
							</div>
							<div className="flex-row flex border-l border-gray/20  space-x-1 font-sans-semi h-full items-center pl-6">
								<p className="font-sans-med">Bewerten</p>
								<img src="/icons/right-arrw.svg" className="w-4"></img>
							</div>
						</div>	
					</> : <>
						<div className="flex-row flex justify-center w-full border-t border-gray/20 h-14 items-center text-sm" onClick={() => openRatingFlow()}>
							<div className="flex-row flex border-gray/20  space-x-1 font-sans-semi h-full items-center">
								<p className="font-sans-med">Bewerten</p>
								<img src="/icons/right-arrw.svg" className="w-4"></img>
							</div>
						</div>
					</>
					}			
				</div>
			</div>
		</motion.div>
		</>
	)
}