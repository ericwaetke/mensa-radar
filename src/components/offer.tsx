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
import Balancer from 'react-wrap-balancer'
import { usePlausible } from "next-plausible";
import Image from "next/image";
import { env } from "../env.mjs";


export const Offer = (
	{
		offer,
		mensa,
		day,
		aiThumbnailBase64,
		triggerAiThumbnailRegeneration
	}: {
    offer: FoodOffering
    mensa: string | string[],
    day: string | string[],
    aiThumbnailBase64: string,
    triggerAiThumbnailRegeneration: (foodId: number, foodTitle: string) => void
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

	const calculateAverageRating = (ratings: { rating: number, userSessionId: string }[]) => {
		let sum = 0;
		ratings.forEach(rating => {
			sum += rating.rating;
		})
		sum = sum / ratings.length;
		return sum || 0;
	}

	const getRatingString = (rating: number) => {
		let calc = Math.round(((rating * 100) / 25 + 1) * 10) / 10;
		let calcString = calc.toString().replace(".", ",");
		return calcString || "";
	}

	const [ratings, setRatings] = useState(offer.ratings)
	const averageRating = useMemo(() => calculateAverageRating(ratings), [ratings])

	const sessionId = useRef(getSessionId())

	const plausible = usePlausible()

	const [modalOpen, setModalOpen] = useState(false);
	const [currentModalContent, setCurrentModalContent] = useState("");
	const openImageFlow = () => {
		setCurrentModalContent("image");
		setModalOpen(true);
		plausible("Start Image Upload")
	}
	const openRatingFlow = () => {
		setCurrentModalContent("rating");
		setModalOpen(true);
		plausible("Start Rating")
	}

	const [tempImage, setTempImage] = useState("");
	const [hasUserRated, setHasUserRated] = useState(false)
	const [userRatingString, setUserRating] = useState("")
	const updateUserRating = (rating: number) => {
		setUserRating(getRatingString(rating))
		setHasUserRated(true);
		setRatings([...ratings, { rating, userSessionId: sessionId.current }])
	}

	// const [averageRatingString, setAverageRatingString] = useState("");
	const averageRatingString = useMemo(() => getRatingString(averageRating), [averageRating]);

	useEffect(() => {
		setHasUserRated(offer.ratings.some(rating => rating.userSessionId === sessionId.current))
		let userRating = offer.ratings.find(rating => rating.userSessionId === sessionId.current)?.rating;
		userRating = Math.round(((userRating * 100) / 25 + 1) * 10) / 10

		setUserRating(userRating.toString())
		// setAverageRatingString(getRatingString(averageRating))
	}, [])


	const generateUrls = (imageName: string) => {
		const params = new URLSearchParams({
			f: imageName + ".png",
			b: "ai-thumbnails",
			w: "512",
			h: null,    // set to null to keep image's aspect ratio
			q: "80",
			token: env.NEXT_PUBLIC_SUPABASE_KEY
		})
		return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ai-thumbnails/${imageName + ".png"}?token=${env.NEXT_PUBLIC_SUPABASE_KEY}`
		return `${process.env.NODE_ENV === "development" ? 'http://localhost:3000' : 'https://mensa-radar.de'}/api/image/?${params.toString()}`
	}
	const [localAiThumbnail, setLocalAiThumbnail] = useState("")
	const [aiThumbnailUrl, setAiThumbnailUrl] = useState(generateUrls(`thumbnail_${offer.id}`))

	const regenerateAiThumbnail = () => {
		setLocalAiThumbnail(null)
		triggerAiThumbnailRegeneration(offer.id, offer.food_title)
	}

	useEffect(() => {
		setLocalAiThumbnail(aiThumbnailBase64)
	}, [aiThumbnailBase64])

	return (<>
		<BottomSheet
			open={modalOpen}
			onDismiss={() => setModalOpen(false)}
			header={
				currentModalContent == "image" ? <>
					<CaptureImageHeader foodTitle={offer.food_title} />
				</> : <>
					<RateFoodHeader foodTitle={offer.food_title} />
				</>
			}
			blocking={true}>
			{
				currentModalContent == "image" ? <>
					<CaptureImage
						setModalOpen={setModalOpen}
						setCurrentModalContent={setCurrentModalContent}
						setTempImage={setTempImage}

						triggerAiThumbnailRegeneration={regenerateAiThumbnail}

						foodTitle={offer.food_title}
						foodId={offer.id} />
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
			className={`mx-auto w-full snap-start flex-row pt-4 sm:max-w-xl`}
			variants={containerAnimation}
			initial="hidden"
			animate="show"
			id={offer.id.toString()}
		>

			<div className={`flex flex-col rounded-2xl bg-white ${offer.sold_out ? "pb-6" : ""} `}>

				<div className="flex flex-col">
					<div className="w-full rounded-t-xl border-b border-gray/20 bg-lightshiny-green p-4">
						<div className="h-min-20 m-auto  w-full max-w-xs rounded-lg xs:max-w-sm">
							{offer.imageUrls.length > 0 || tempImage != "" ?
								<>
									<div onClick={() => openImageFlow()} className="relative m-auto h-52 w-4/6 cursor-pointer ">
										{
											tempImage !== "" ?
												<img src={tempImage} className="h-full rounded-lg object-cover" />
												:
												<Image src={offer.imageUrls[offer.imageUrls.length - 1]} className="h-full w-full rounded-lg object-cover" layout="fill" />
										}
										<span className="absolute left-2 top-2 flex space-x-1  rounded-full bg-white/60 px-2 py-1 font-sans-med text-xs text-black backdrop-blur">
											<span>Nutzer:innen-Foto</span>
										</span>
										<span className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center space-x-1 rounded-full bg-white font-sans-med text-white backdrop-blur">
											<img alt="Eigenes Foto" src="/icons/camera.svg" className="w-6"></img>
										</span>
									</div>
								</>
								: offer.has_ai_thumbnail || (localAiThumbnail && localAiThumbnail !== "") ? <>

									{
										offer.has_ai_thumbnail
											? <div onClick={() => openImageFlow()} className="relative m-auto h-48 w-full cursor-pointer ">
												<Image className="h-full w-full rounded-lg object-cover" src={aiThumbnailUrl} layout="fill" key={offer.id} />

												<span className="absolute left-2 top-2 flex space-x-1  rounded-full bg-white/60 px-2 py-1 font-sans-med text-xs text-black backdrop-blur">
													<svg role="img" xmlns="http://www.w3.org/2000/svg" className="h-full" width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" aria-labelledby="boltIconTitle" stroke="currentColor" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#000"> <title id="boltIconTitle">Bolt</title> <path d="M5 14l8-11v7h5l-8 11v-7z"/> </svg>

													<span>AI-generiert</span>
												</span>
												<span className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center space-x-1 rounded-full bg-white font-sans-med text-white backdrop-blur">
													<img alt="Eigenes Foto aufnehmen" src="/icons/camera.svg" className="w-6"></img>
												</span>
											</div>
											:

											<div onClick={() => openImageFlow()} className="relative m-auto h-48 w-full cursor-pointer ">
												<img src={`data:image/png;base64,${localAiThumbnail}`} onClick={() => openImageFlow()} className="relative h-full w-full rounded-lg object-cover" />
												<span className="absolute left-2 top-2 flex space-x-1  rounded-full bg-white/60 px-2 py-1 font-sans-med text-xs text-black backdrop-blur">
													<svg role="img" xmlns="http://www.w3.org/2000/svg" className="h-full" width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" aria-labelledby="boltIconTitle" stroke="currentColor" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#000"> <title id="boltIconTitle">Bolt</title> <path d="M5 14l8-11v7h5l-8 11v-7z"/> </svg>

													<span>AI-generiert</span>
												</span>
												<span className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center space-x-1 rounded-full bg-white font-sans-med text-white backdrop-blur">
													<img alt="Eigenes Foto aufnehmen" src="/icons/camera.svg" className="w-6"></img>
												</span>
											</div>
									}
								</> :
									<div className={`flex h-full max-w-full animate-pulse items-center justify-center rounded-lg bg-gray/20 ${offer.sold_out ? "hidden" : ""}`}>
										<span className="m-2 flex h-12 flex-row items-center justify-center gap-2 rounded-full bg-white px-4 opacity-100">
											<img alt="Eigenes Foto aufnehmen" src="/icons/camera.svg" className="w-6"></img>
                      Foto aufnehmen
										</span>
									</div>
							}
						</div>
					</div>

					<div className="flex flex-col space-y-4 p-6 text-sm">
						<div className="flex-col space-y-2">
							<h2 className={`text-h2 font-serif-semi ${offer.sold_out ? "text-gray/50" : ""}`}>
								<Balancer>
									{offer.food_title}
								</Balancer>
							</h2>

							<Allergens allergens={offer.allergens} />
							<div className="flex flex-row flex-wrap gap-x-2 space-y-1 font-sans-med">
								{offer.sold_out ? <>
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
										<Pill col={"black"}><p>😢 </p>Ausverkauft</Pill>
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
					</div>
				</div>
				<div>
					{
						ratings.length !== 0 ? <>
							<div className="flex h-12 w-full cursor-pointer flex-row items-center justify-between border-t border-gray/20 px-6 text-sm" onClick={() => openRatingFlow()}>
								<div className="flex flex-row space-x-1 whitespace-nowrap font-sans-semi">
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
									<p className="hidden font-sans-med text-gray/50 xs:block">·</p>
									<p className="hidden font-sans-med text-gray/50 xs:block">{ratings.length === 1 ? "1 Bew." : `${ratings.length} Bew.`}</p>
									<p className="block font-sans-med text-gray/50 xs:hidden">{`(${ratings.length})`}</p>

								</div>

								<div className="flex h-full cursor-pointer flex-row  items-center space-x-1 border-l border-gray/20 pl-6 font-sans-semi">
									<div className="font-sans-med">
										{
											hasUserRated ?
												<>
													<div className="inline-flex flex-row items-center space-x-2">
														<div className="inline-flex flex-row space-x-1 whitespace-nowrap rounded-full bg-light-green px-3 py-1 font-sans-reg text-sm">
															<p>Du:</p>
															<p className="font-sans-semi">
																{userRatingString} / 5</p>
															<img src="/icons/right-arrw.svg" className="w-4"></img>
														</div>
													</div>
												</> : <>
													<div className="flex h-full flex-row items-center space-x-1 font-sans-med">
														<p>Essen bewerten</p>
														<img src="/icons/right-arrw.svg" className="w-4"></img>
													</div>
												</>
										}

									</div>

								</div>
							</div>
						</> : <>
							<div className={`flex h-12 w-full cursor-pointer flex-row items-center justify-center divide-x border-t border-gray/20 text-sm ${offer.sold_out ? "hidden" : ""} `}>
								<div className="flex h-full w-full flex-row  items-center justify-center space-x-1 border-gray/20 font-sans-semi" onClick={() => openRatingFlow()}>
									<p className="font-sans-med">Essen bewerten</p>
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
