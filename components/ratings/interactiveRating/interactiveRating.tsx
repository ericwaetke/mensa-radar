import { useEffect, useRef, useState } from "react"
import { InteractiveAmountRatingComponent } from "./AmountRatingComponent"
import { InteractiveQualityRatingComponent } from "./QualityRatingComponent"
import { getItem, setItem } from '../../../lib/localStorageHelper';
import { makeId } from '../../../lib/makeId';
import styles from "./InteractiveRating.module.css"
import { amountDescription, qualityDescriptions } from "../ratingOverview";
import { motion } from "framer-motion";

export const InteractiveRating = (
	{
		qualityRatings,
		userQualityRatingInitial, 
		setParentUserQualityRating,

		amountRatings,
		userAmountRatingInitial,
		setParentUserAmountRating,

		offerId,
		mensa,
		closeRatingModal
	}: 
	{
		qualityRatings: {sessionId: string, rating: number}[],
		userQualityRatingInitial: number, 
		setParentUserQualityRating: (rating: number) => void,

		amountRatings: {sessionId: string, rating: number}[],
		userAmountRatingInitial: number,
		setParentUserAmountRating: (rating: number) => void,

		offerId: string,
		mensa: string,
		closeRatingModal: () => void
	}) => {

	const [userQualityRating, setUserQualityRating] = useState(userQualityRatingInitial)
	const [userAmountRating, setUserAmountRating] = useState(5)

	const sessionId = useRef(getItem("sessionId"))

	const saveRatings = () => {
		fetch("/api/qualityReview", {
			method: "POST",
			body: JSON.stringify({
				offer: offerId,
				qualityRatings,
				rating: userQualityRating,
				mensa,
				sessionId: sessionId.current
			})
		})
		.then((res) => res.json())
		.then((data) => {
		}).catch((err) => {
			console.log(err)
		})
		fetch("/api/amountReview", {
			method: "POST",
			body: JSON.stringify({
				offer: offerId,
				amountRatings,
				rating: userAmountRating,
				mensa,
				sessionId: sessionId.current
			})
		})
		.then((res) => res.json())
		.then((data) => {
		}).catch((err) => {
			console.log(err)
		})
	}

	const container = {
		hidden: { 
			opacity: 0,
			y: 100
		},
		show: {
			opacity: 1,
			y: 0,
		}
	}

	const initiateClose = () => {
		saveRatings()
		closeRatingModal()
	}

	useEffect(() => {
		if (!sessionId.current) {
			const tempSessionId = makeId()
			console.log(tempSessionId)
			sessionId.current = tempSessionId
			setItem("sessionId", sessionId)
		}
		console.log("sessionId", sessionId)
	}, [])

	return (
		<motion.div 
		className='w-full h-full fixed top-0 left-0 backdrop-blur-md flex items-end justify-center pointer-events-none'
		variants={container}
		initial="hidden"
		animate="show">
			<div className='bg-main-white w-full flex flex-col gap-4 rounded-tl-2xl rounded-tr-2xl p-8 max-w-prose pointer-events-auto'>
				<button className='bg-custom-white w-full text-custom-black h-8 rounded-full' onClick={closeRatingModal}>v</button>
				
				<div className="flex flex-col gap-2">
					<label className="uppercase text-sm font-bold">Bewerten</label>
					<InteractiveQualityRatingComponent handleUserQualityRating={(e) => setUserQualityRating(e)} userQualityRating={userQualityRating} />	
					<p className="font-serif italic">
						{
							qualityDescriptions[userQualityRating]
						}
					</p>
				</div>

				<hr />
				
				<div className="flex flex-col gap-2">
					<label>Wie war die Menge?</label>
					<InteractiveAmountRatingComponent amount={userAmountRating} setAmount={(e) => setUserAmountRating(e)} className={styles.rangeInput}/>
					<p className="font-serif italic">{
						userAmountRating >= 8 ? amountDescription[8] :
						userAmountRating >= 6 ? amountDescription[6] :
						userAmountRating >= 4 ? amountDescription[4] :
						userAmountRating >= 2 ? amountDescription[2] :
						userAmountRating >= 0 ? amountDescription[0] : ""
					}</p>
				</div>
			</div>	
		</motion.div>	
	)
}