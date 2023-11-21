/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"

import Modal from "react-modal"
import { CaptureImage, CaptureImageHeader } from "../imageFlow/CaptureImage"
import RateFood, { RateFoodHeader } from "../ratings/RateFood"
import { Allergens } from "../allergens"
import { getSessionId } from "../../lib/localStorageHelper"
import { BottomSheet } from "react-spring-bottom-sheet"
import { Tooltip } from "react-tooltip"
import { Pill } from "../pill"
import Balancer from "react-wrap-balancer"
import { usePlausible } from "next-plausible"
import { env } from "../../env.mjs"
import { ImageCarousel } from "./imageCarousel"
import Image from "next/image"
import { ShareButton } from "./share"
Modal.setAppElement("#__next")

export const Offer = ({
	offer,
	mensa,
	day,
	aiThumbnailBase64,
}: {
	offer: NewFoodOffer
	mensa: string | string[]
	day: string | string[]
	aiThumbnailBase64: string
}) => {
	const containerAnimation = {
		hidden: {
			opacity: 0,
			scale: 0.7,
			bottom: -50,
		},
		show: {
			opacity: 1,
			scale: 1,
			bottom: 0,
			transition: {
				staggerChildren: 0.5,
				delayChildren: 0.1,
				delay: 0.2,
				duration: 0.5,
			},
		},
	}

	const formatter = new Intl.NumberFormat("de-DE", {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: 2,
	})

	const emojis = ["🤮", "😕", "😊", "😋"]

	const calculateAverageRating = (
		ratings: { rating: number; userSessionId: string }[]
	) => {
		let sum = 0
		ratings.forEach((rating) => {
			sum += rating.rating
		})
		sum = sum / ratings.length
		return sum || 0
	}

	const getRatingString = (rating: number) => {
		let calc = Math.round(((rating * 100) / 25 + 1) * 10) / 10
		let calcString = calc.toString().replace(".", ",")
		return calcString || ""
	}

	const [ratings, setRatings] = useState(offer.qualityReviews)
	const averageRating = useMemo(
		() => calculateAverageRating(ratings),
		[ratings]
	)

	const sessionId = useRef(getSessionId())

	const plausible = usePlausible()

	const [modalOpen, setModalOpen] = useState(false)
	const [currentModalContent, setCurrentModalContent] = useState("")
	const openImageFlow = () => {
		setCurrentModalContent("image")
		setModalOpen(true)
		plausible("Start Image Upload")
	}
	const openRatingFlow = () => {
		setCurrentModalContent("rating")
		setModalOpen(true)
		plausible("Start Rating")
	}

	const [tempImage, setTempImage] = useState("")
	const [hasUserRated, setHasUserRated] = useState(false)
	const [userRatingString, setUserRating] = useState("")
	const updateUserRating = (rating: number) => {
		setUserRating(getRatingString(rating))
		setHasUserRated(true)
		setRatings([...ratings, { rating, userSessionId: sessionId.current }])
	}

	// const [averageRatingString, setAverageRatingString] = useState("");
	const averageRatingString = useMemo(
		() => getRatingString(averageRating),
		[averageRating]
	)

	useEffect(() => {
		setHasUserRated(
			offer.qualityReviews.some(
				(rating) => rating.userSessionId === sessionId.current
			)
		)
		let userRating = offer.qualityReviews.find(
			(rating) => rating.userSessionId === sessionId.current
		)?.rating
		userRating = Math.round(((userRating * 100) / 25 + 1) * 10) / 10

		setUserRating(userRating.toString())
		// setAverageRatingString(getRatingString(averageRating))
	}, [])

	const generateUrls = (imageName: string) => {
		const params = new URLSearchParams({
			f: imageName + ".png",
			b: "ai-thumbnails",
			w: "512",
			h: null, // set to null to keep image's aspect ratio
			q: "80",
			token: env.NEXT_PUBLIC_SUPABASE_KEY,
		})
		return `${
			env.NEXT_PUBLIC_SUPABASE_URL
		}/storage/v1/object/public/ai-thumbnails/${imageName + ".png"}?token=${
			env.NEXT_PUBLIC_SUPABASE_KEY
		}`
	}
	const [localAiThumbnail, setLocalAiThumbnail] = useState("")
	const [aiThumbnailUrl, setAiThumbnailUrl] = useState(
		generateUrls(`thumbnail_${offer.id}`)
	)

	useEffect(() => {
		setLocalAiThumbnail(aiThumbnailBase64)
	}, [aiThumbnailBase64])

	const pillAnimationContainer = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.5,
			},
		},
	}

	const isFoodOffer = offer.priceOther !== 0 && offer.priceStudents !== 0

	return (
		<>
			<BottomSheet
				open={modalOpen}
				onDismiss={() => setModalOpen(false)}
				header={
					currentModalContent == "image" ? (
						<>
							<CaptureImageHeader foodTitle={offer.foodTitle} />
						</>
					) : (
						<>
							<RateFoodHeader foodTitle={offer.foodTitle} />
						</>
					)
				}
				blocking={true}>
				{currentModalContent == "image" ? (
					<>
						<CaptureImage
							setModalOpen={setModalOpen}
							setCurrentModalContent={setCurrentModalContent}
							setTempImage={setTempImage}
							foodTitle={offer.foodTitle}
							foodId={offer.id}
						/>
					</>
				) : currentModalContent === "rating" ? (
					<>
						<RateFood
							setModalOpen={setModalOpen}
							setCurrentModalContent={setCurrentModalContent}
							foodTitle={offer.foodTitle}
							foodId={offer.id}
							updateUserRating={updateUserRating}
						/>
					</>
				) : null}
			</BottomSheet>
			<div
				className={`relative mx-auto w-full snap-start flex-row pt-4 sm:max-w-xl ${
					!isFoodOffer && offer.foodTitle.includes("Info")
						? "-order-1"
						: !isFoodOffer && "order-1"
				}`}
				// variants={containerAnimation}
				id={offer.id.toString()}>
				<div
					className={`flex flex-col rounded-2xl bg-white ${
						offer.soldOut ? "pb-6" : ""
					} `}>
					<div className="flex flex-col">
						{isFoodOffer && (
							<ImageCarousel
								offer={offer}
								aiThumbnailUrl={aiThumbnailUrl}
								localAiThumbnail={localAiThumbnail}
								openImageFlow={() =>
									!modalOpen ? openImageFlow() : null
								}
								tempImage={tempImage}
								key={offer.id}
								soldOut={offer.soldOut}
								blurhash={offer.blurhash}
							/>
						)}

						<div className="flex flex-col space-y-4 p-6 text-sm">
							<div className="flex-col space-y-2">
								<h2
									className={`text-h2 font-serif-semi ${
										offer.soldOut ? "text-gray/50" : ""
									}`}>
									<Balancer>{offer.foodTitle}</Balancer>
								</h2>

								<Allergens allergens={offer.allergens} />

								{isFoodOffer && (
									<motion.div
										className="flex flex-row flex-wrap gap-x-2 space-y-1 pt-4 font-sans-med"
										variants={pillAnimationContainer}
										initial="hidden"
										animate="show">
										{offer.soldOut ? (
											<></>
										) : (
											<>
												<Pill>
													<p
														id={`price-students-${offer.id}`}
														data-tooltip-content="Preis für Studierende">
														{formatter.format(
															offer.priceStudents
														)}
													</p>
													<p className="text-gray/50">
														·
													</p>
													<p
														className="text-gray/50"
														id={`price-others-${offer.id}`}
														data-tooltip-content="Preis für andere">
														{formatter.format(
															offer.priceOther
														)}
													</p>
												</Pill>
											</>
										)}
										{offer.soldOut ? (
											<>
												<Pill col={"black"}>
													<p>😢 </p>Ausverkauft
												</Pill>
											</>
										) : offer.vegan ? (
											<>
												<Pill
													col={"vegan"}
													icon={"/icons/vegan.svg"}>
													Vegan
												</Pill>
											</>
										) : offer.vegetarian ? (
											<>
												<Pill
													col={"vegeterian"}
													icon={
														"/icons/vegeterian.svg"
													}>
													Vegetarisch
												</Pill>
											</>
										) : offer.fish ? (
											<>
												<Pill
													col={"fish"}
													icon={
														"/icons/allergene/Fisch.svg"
													}>
													Fisch
												</Pill>
											</>
										) : offer.meat &&
										  offer.allergens.includes(
												"tierisches Lab"
										  ) ? (
											<>
												<Pill
													col={"meat"}
													icon={"/icons/meat.svg"}>
													Tierisches Lab
												</Pill>
											</>
										) : offer.meat ? (
											<>
												<Pill
													col={"meat"}
													icon={"/icons/meat.svg"}>
													Fleisch
												</Pill>
											</>
										) : null}
									</motion.div>
								)}
							</div>
						</div>
					</div>
					{isFoodOffer && (
						<div>
							{ratings.length !== 0 ? (
								<>
									<div
										className="flex h-12 w-full cursor-pointer flex-row items-center justify-between border-t border-gray/20 px-6 text-sm"
										onClick={() =>
											!modalOpen ? openRatingFlow() : null
										}>
										<div className="flex flex-row space-x-1 whitespace-nowrap font-sans-semi">
											<p>
												{averageRating < 0.25
													? emojis[0]
													: averageRating < 0.5
													? emojis[1]
													: averageRating < 0.75
													? emojis[2]
													: emojis[3]}
											</p>
											<p>{averageRatingString} / 5</p>
											<p className="hidden font-sans-med text-gray/50 xs:block">
												·
											</p>
											<p className="hidden font-sans-med text-gray/50 xs:block">
												{ratings.length === 1
													? "1 Bew."
													: `${ratings.length} Bew.`}
											</p>
											<p className="block font-sans-med text-gray/50 xs:hidden">{`(${ratings.length})`}</p>
										</div>

										<div className="flex h-full cursor-pointer flex-row  items-center space-x-1 border-l border-gray/20 pl-6 font-sans-semi">
											<div className="font-sans-med">
												{hasUserRated ? (
													<>
														<div className="inline-flex flex-row items-center space-x-2">
															<div className="inline-flex flex-row space-x-1 whitespace-nowrap rounded-full bg-light-green px-3 py-1 font-sans-reg text-sm">
																<p>Du:</p>
																<p className="font-sans-semi">
																	{
																		userRatingString
																	}{" "}
																	/ 5
																</p>
																<Image
																	src="/icons/right-arrw.svg"
																	width={16}
																	height={16}
																	alt="right arrow"
																	className="w-4"
																/>
															</div>
														</div>
													</>
												) : (
													<>
														<div className="flex h-full flex-row items-center space-x-1 font-sans-med">
															<p>
																Essen bewerten
															</p>
															<Image
																src="/icons/right-arrw.svg"
																width={16}
																height={16}
																alt="right arrow"
																className="w-4"
															/>
														</div>
													</>
												)}
											</div>
										</div>
									</div>
								</>
							) : (
								<>
									<div
										className={`flex h-12 w-full cursor-pointer flex-row items-center justify-center divide-x divide-gray/20 border-t border-gray/20 text-sm ${
											offer.soldOut ? "hidden" : ""
										} `}>
										<div
											className="flex h-full w-full flex-row  items-center justify-center gap-2 border-gray/20 font-sans-semi"
											onClick={() =>
												!modalOpen
													? openRatingFlow()
													: null
											}>
											<p className="font-sans-med">
												Essen bewerten
											</p>
											<Image
												src="/icons/right-arrw.svg"
												width={16}
												height={16}
												alt="right arrow"
												className="w-4"
											/>
										</div>
										<ShareButton
											url={`https://mensa-radar.de/mensa/${mensa}/${day}/${offer.id}`}
											title={offer.foodTitle}
										/>
									</div>
								</>
							)}
						</div>
					)}
				</div>
			</div>
			<Tooltip anchorId={`price-students-${offer.id}`} />
			<Tooltip anchorId={`price-others-${offer.id}`} />
		</>
	)
}
