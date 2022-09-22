import { useEffect, useRef, useState } from "react"
import { InteractiveAmountRatingComponent } from "./interactiveRatingComponents/interactiveAmountRatingComponent"
import { InteractiveQualityRatingComponent } from "./interactiveRatingComponents/interactiveQualityRatingComponent"
import { getItem, setItem } from '../../lib/localStorageHelper';
import { makeId } from '../../lib/makeId';
import styles from "./InteractiveRating.module.css"

export const InteractiveRating = (
	{
		qualityRatings,
		userQualityRatingInitial, 
		amountRatings,
		userAmountRatingInitial,
		offerId,
		mensa,
		closeRatingModal
	}: 
	{
		qualityRatings: {sessionId: string, rating: number}[],
		userQualityRatingInitial: number, 
		amountRatings: {sessionId: string, rating: number}[],
		userAmountRatingInitial: number,
		offerId: string,
		mensa: string,
		closeRatingModal: () => void
	}) => {

	const [userQualityRating, setUserQualityRating] = useState(userQualityRatingInitial)
	const [userAmountRating, setUserAmountRating] = useState(5)

	const amountDescription = {
		0: "Viel zu wenig",
		2: "Zu wenig",
		4: "Wie erwartet",
		6: "Viel",
		8: "Viel zu viel"
	}

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
		<div className='w-full h-full fixed top-0 left-0 backdrop-blur-md flex items-center justify-center pointer-events-none'>
			<div className='bg-modal-green rounded-xl p-8 max-w-prose pointer-events-auto'>
				<button className='bg-custom-white text-custom-black w-8 h-8 rounded-full' onClick={closeRatingModal}>x</button>
				<label>Wie hat es dir geschmeckt?</label>
				<InteractiveQualityRatingComponent handleUserQualityRating={(e) => setUserQualityRating(e)} userQualityRating={userQualityRating} />	
				<p>Wähle einen Stern</p>
				<hr />
				<label>Wie war die Menge?</label>
				<InteractiveAmountRatingComponent amount={userAmountRating} setAmount={(e) => setUserAmountRating(e)} className={styles.rangeInput}/>
				<p>{
					userAmountRating >= 8 ? amountDescription[8] :
					userAmountRating >= 6 ? amountDescription[6] :
					userAmountRating >= 4 ? amountDescription[4] :
					userAmountRating >= 2 ? amountDescription[2] :
					userAmountRating >= 0 ? amountDescription[0] : ""
				}</p>

				<button className='bg-red-400' onClick={() => saveRatings()}>Save</button>
			</div>	
		</div>	
	)
}