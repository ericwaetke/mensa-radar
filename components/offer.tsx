import { motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"

import Modal from "react-modal"
Modal.setAppElement('#__next');
import { CaptureImage, CaptureImageHeader } from "./imageFlow/CaptureImage"
import RateFood, { RateFoodHeader } from "./ratings/RateFood"
import { Allergens } from "./allergens"
import { getSessionId } from "../lib/localStorageHelper"
import { BottomSheet } from "react-spring-bottom-sheet";
import { Tooltip } from "react-tooltip"
import { Pill } from "./pill";

export const Offer = (
	{
		offer,
		mensa,
		day,
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
		sum = sum / ratings.length;
		return sum || 0;
	}
	const getRatingString = (rating: number) => {
		let calc = Math.round(((rating * 100) / 25 + 1)*10)/10;
		let calcString = calc.toString().replace(".", ",");
		return calcString || "";
	}
	const [ratings, setRatings] = useState(offer.ratings)
	const averageRating = useMemo(() => calculateAverageRating(ratings), [ratings])

	const sessionId = useRef(getSessionId())

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

	const [tempImage, setTempImage] = useState("");
	const [hasUserRated, setHasUserRated] = useState(false)
	const [userRatingString, setUserRating] = useState("")
	const updateUserRating = (rating: number) => {
		setUserRating(getRatingString(rating))
		setHasUserRated(true);
		setRatings([...ratings, {rating, userSessionId: sessionId.current}])
	}

	// const [averageRatingString, setAverageRatingString] = useState("");
	const averageRatingString = useMemo(() => getRatingString(averageRating), [averageRating]);

	useEffect(() => {
		setHasUserRated(offer.ratings.some(rating => rating.userSessionId === sessionId.current))
		let userRating = offer.ratings.find(rating => rating.userSessionId === sessionId.current)?.rating;
		userRating = Math.round(((userRating * 100) / 25 + 1)*10)/10

		setUserRating(userRating.toString())
		// setAverageRatingString(getRatingString(averageRating))
	}, [])

	return (<>
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
					</> : null
				}
		</BottomSheet>
		<motion.div
			className={`snap-start w-full flex-row pt-4 sm:max-w-xl mx-auto`}
			variants={containerAnimation}
			initial="hidden"
			animate="show"
			>

			<div className={`rounded-2xl bg-white flex flex-col space-y-2 ${offer.sold_out ? "pb-6" : ""} `}>

					<div className="px-2 pt-2">
						{ offer.imageUrls.length > 0 || tempImage != "" ?
							<div className="w-full h-44 bg-lightshiny-green rounded-xl">
								{
									tempImage !== "" ? <img src={tempImage} className="w-full h-full object-cover rounded-tl-lg rounded-bl-md rounded-br-md rounded-tr-lg" /> : <img src={offer.imageUrls[offer.imageUrls.length-1]} className="w-full h-full object-cover rounded-tl-lg rounded-bl-md rounded-br-md rounded-tr-lg" />
								}
							</div>
						:
							<div className={`w-full h-20 bg-gray/20 rounded-tl-lg rounded-bl-md rounded-br-md rounded-tr-lg flex justify-center items-center ${offer.sold_out ? "hidden" : ""}`}>
								{
									<div onClick={() => openImageFlow()} className={`rounded-lg border border-gray/20 py-3 px-4 font-sans-med flex flex-row space-x-2 text-sm cursor-pointer`} >
										<img src="/icons/camera.svg" className="w-4"></img>
										<p>Foto hochladen</p>
									</div>
								}
							</div>
						}
					</div>

				<div className="flex flex-col space-y-4 text-sm">
					<div className="px-6 flex-col space-y-2">
						<h2 className={`text-h2 font-serif-semi pt-2 ${offer.sold_out ? "text-gray/50" : ""}`}>
							{offer.food_title}
						</h2>

						<Allergens allergens={offer.allergens}/>
						<div className="flex flex-row gap-x-2 font-sans-med">
							{ offer.sold_out ? <>
							</> : <>
								<Pill>
									<p id={`price-students-${offer.id}`} data-tooltip-content="Preis für Studierende">{formatter.format(offer.price_students)}</p>
									<p className="text-gray/50">·</p>
									<p className="text-gray/50" id={`price-others-${offer.id}`} data-tooltip-content="Preis für andere">{formatter.format(offer.price_other)}</p>
								</Pill>
							</>
							}
							{
								offer.sold_out ? <>
								<Pill col={"black"}><p>😢</p> Ausverkauft</Pill>
								</> : 
								offer.vegan ? <>
									<Pill col={"vegan"} icon={"/icons/vegan.svg"}>Vegan</Pill>
								</> : offer.vegetarian ? <>
									<Pill col={"vegeterian"} icon={"/icons/vegeterian.svg"}>Vegetarisch</Pill>
								</> : offer.fish ? <>
									<Pill col={"fish"} icon={"/icons/allergene/Fisch.svg"}>Fisch</Pill>
								</> : offer.meat ? <>
									<Pill col={"meat"} icon={"/icons/meat.svg"}>Fleisch</Pill>
								</> : 
								null
							}
						</div>
						{/* TODO: Rating */}

					</div>
					{
					ratings.length !== 0 ? <>
						<div className="flex-row flex justify-between w-full px-6 border-t border-gray/20 h-12 items-center text-sm cursor-pointer" onClick={() => openRatingFlow()}>
							<div className="flex-row flex space-x-1 font-sans-semi whitespace-nowrap">
								<p>
									{
									averageRating < 0.25 ? emojis[0] :
									averageRating < 0.5 ? emojis[1] :
									averageRating < 0.75 ? emojis[2] :
									emojis[3]
									}
								</p>
								<p>{
									averageRatingString
									} / 5</p>
								<p className="font-sans-med text-gray/50 hidden xs:block">·</p>
								<p className="font-sans-med text-gray/50 hidden xs:block">{ratings.length === 1 ? "1 Bew." : `${ratings.length} Bew.`}</p>
								<p className="font-sans-med text-gray/50 xs:hidden block">{ `(${ratings.length})`}</p>

							</div>

							<div className="flex-row flex border-l border-gray/20  space-x-1 font-sans-semi h-full items-center pl-6">
								<div className="font-sans-med">
									{
									hasUserRated ?
									<>
										<div className="inline-flex flex-row items-center space-x-2">
											<div className="inline-flex flex-row space-x-1 px-3 py-1 rounded-full font-sans-reg text-sm bg-light-green whitespace-nowrap">
												<p>Du:</p>
												<p className="font-sans-semi">
												{ userRatingString } / 5</p>
												<img src="/icons/right-arrw.svg" className="w-4"></img>
											</div>
										</div>
									</> : <>
										<div className="flex-row flex space-x-1 font-sans-med h-full items-center cursor-pointer">
											<p>Bewerten</p>
											<img src="/icons/right-arrw.svg" className="w-4"></img>
										</div>
									</>
									}

								</div>

							</div>
						</div>
					</> : <>
						<div className={`flex-row flex justify-center w-full border-t border-gray/20 h-12 items-center text-sm ${offer.sold_out ? "hidden" : ""} `} onClick={() => openRatingFlow()}>
							<div className="flex-row flex border-gray/20 space-x-1 font-sans-semi h-full items-center">
								<p className="font-sans-med">Bewerten</p>
								<img src="/icons/right-arrw.svg" className="w-4"></img>
							</div>
						</div>
					</>
					}
				</div>
			</div>
		</motion.div>
		<Tooltip anchorId={`price-students-${offer.id}`} />
		<Tooltip anchorId={`price-others-${offer.id}`} />
		</>
		
	)
}
