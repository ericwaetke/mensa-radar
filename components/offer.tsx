import { motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"

import Modal from "react-modal"
Modal.setAppElement('#__next');
import { CaptureImage, CaptureImageHeader } from "./imageFlow/CaptureImage"
import RateFood, { RateFoodHeader } from "./ratings/RateFood"
import { Allergens } from "./allergens"
import { getSessionId } from "../lib/localStorageHelper"
import { BottomSheet } from "react-spring-bottom-sheet";
import { userAgent } from "next/server";

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
		let i = ((sum / ratings.length) * 100) / 25 + 1;
		i = Math.round(i * 10)/10;
		return i || 0;
	}
	const averageRating = useMemo(() => calculateAverageRating(offer.ratings), [offer.ratings])
	const averageRatingString = averageRating.toString().replace(".", ",");

	const sessionId = useRef(getSessionId())

	const [hasUserRated, setHasUserRated] = useState(false)
	const [userRating, setUserRating] = useState(0)
	const updateUserRating = (rating: number) => {
		setUserRating(rating)
		setHasUserRated(true)
	}

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
		setUserRating(offer.ratings.find(rating => rating.userSessionId === sessionId.current)?.rating * 5 || 0)
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
							updateUserRating={updateUserRating}
							/>
					</> : <></>
				}
		</BottomSheet>
		<motion.div 
			className={`snap-start w-full flex-row pt-4 sm:max-w-xl mx-auto`}
			variants={containerAnimation}
			initial="hidden"
			animate="show"
			>
				
			<div ref={reff} className={`rounded-2xl  bg-white pt-3 flex flex-col justify-between ${offer.sold_out ? "opacity-50" : ""}`}>
				<div className="flex-col space-y-3  px-3 mb-auto">
				{
					offer.imageUrls.length > 0 || tempImage != "" ? <div className="w-full h-44 bg-lightshiny-green rounded-xl">
						{
							tempImage !== "" ? <img src={tempImage} className="w-full h-full object-cover rounded-tl-lg rounded-bl-md rounded-br-md rounded-tr-lg" /> : <img src={offer.imageUrls[offer.imageUrls.length-1]} className="w-full h-full object-cover rounded-tl-lg rounded-bl-md rounded-br-md rounded-tr-lg" />
						} 
					</div> : 
					<div className="w-full h-20 bg-lightshiny-green rounded-tl-lg rounded-bl-md rounded-br-md rounded-tr-lg flex justify-center items-center">
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
					<div className="px-6 flex-col space-y-2">
						<div className="flex flex-row justify-between font-sans-med">
							<div className="inline-flex flex-row space-x-1.5 px-3 py-1 rounded-full bg-light-green">
								<p>{formatter.format(offer.price_students)}</p>
								<p className="text-gray/50">·</p>
								<p className="text-gray/50">{formatter.format(offer.price_other)}</p>
							</div>
							{
								offer.vegan ? <>
									<div className="inline-flex flex-row space-x-1 px-3 pl-2 py-1 bg-main-green items-center rounded-full">
										<img src="/icons/vegan.svg" className="w-4"></img>
										<p>vegan</p>
									</div>
								</> : offer.vegetarian ? <>
									<div className="inline-flex flex-row space-x-1 px-3 pl-2 py-1 bg-vegeterian-yellow items-center rounded-full text-sm">
										<img src="/icons/vegeterian.svg" className="w-4"></img>
										<p>vegetarisch</p>
									</div>
								</> : offer.fish ? <>
									<div className="inline-flex flex-row space-x-1 px-3 pl-2 py-1 bg-blue-fish items-center rounded-full  text-sm">
										<img src="/icons/allergene/Fisch.svg" className="w-4"></img>
										<p>Fisch</p>
									</div>
								</> : offer.meat ? <>
									<div className="inline-flex flex-row space-x-1 px-3 pl-2 py-1 bg-meat-red items-center rounded-full  text-sm">
										<img src="/icons/meat.svg" className="w-4"></img>
										<p>Fleisch</p>
									</div>
								</> : offer.sold_out? <>
									<div className="inline-flex flex-row space-x-1 px-3 pl-2 py-1 bg-light-green items-center rounded-full font-sans-semi text-sm">
										<p>😢</p>
										<p>Ausverkauft</p>
									</div>
								</> :
								null
							}
						</div>
						{/* TODO: Rating */}
						
					</div>
					{
					offer.ratings.length !== 0 ? <>
						<div className="flex-row flex justify-between w-full px-6 border-t border-gray/20 h-12 items-center text-sm" onClick={() => openRatingFlow()}>
							<div className="flex-row flex space-x-1 font-sans-semi whitespace-nowrap">
								<p>
									{
									averageRating < 2 ? emojis[0] :
									averageRating < 3 ? emojis[1] :
									averageRating < 4 ? emojis[2] :
									emojis[3]
									}
								</p>
								<p>{
									averageRatingString
									} / 5</p>
								<p className="font-sans-med text-gray/50 hidden xs:block">·</p>
								<p className="font-sans-med text-gray/50 hidden xs:block">{offer.ratings.length === 1 ? "1 Bew." : `${offer.ratings.length} Bew.`}</p>
								<p className="font-sans-med text-gray/50 xs:hidden block">{ `(${offer.ratings.length})`}</p>

							</div>
				
							<div className="flex-row flex border-l border-gray/20  space-x-1 font-sans-semi h-full items-center pl-6">
								<p className="font-sans-med">
									{	
									hasUserRated ? 
									<>
										<div className="inline-flex flex-row items-center space-x-2">
											<div className="inline-flex flex-row space-x-1 px-3 py-1 rounded-full font-sans-reg text-sm bg-light-green whitespace-nowrap"> 
												<p>Du:</p>
												<p className="font-sans-semi">
												{ userRating } / 5</p> 
												<img src="/icons/right-arrw.svg" className="w-4"></img>
											</div> 
										</div> 
									</> : <>
										<div className="flex-row flex space-x-1 font-sans-med h-full items-center">
											<p>Bewerten</p> 
											<img src="/icons/right-arrw.svg" className="w-4"></img>
										</div>
									</>
									}

								</p>
								
							</div>
						</div>	
					</> : <>
						<div className="flex-row flex justify-center w-full border-t border-gray/20 h-12 items-center text-sm" onClick={() => openRatingFlow()}>
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