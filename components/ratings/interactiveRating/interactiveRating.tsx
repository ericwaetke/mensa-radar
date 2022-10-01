import { useEffect, useRef, useState } from "react"
import { InteractiveAmountRatingComponent } from "./AmountRatingComponent"
import { InteractiveQualityRatingComponent } from "./QualityRatingComponent"
import { getItem, setItem } from '../../../lib/localStorageHelper';
import { makeId } from '../../../lib/makeId';
import styles from "./InteractiveRating.module.css"
import { amountDescription, qualityDescriptions } from "../ratingOverview";
import { motion } from "framer-motion";
import useTimeout from "use-timeout";
import toast, { useToasterStore } from "react-hot-toast"

export const InteractiveRating = (
	{
		qualityRatings,
		userQualityRatingInitial, 
		setParentUserQualityRating,

		amountRatings,
		userAmountRatingInitial,
		setParentUserAmountRating,

		setHasUserRating,

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

		setHasUserRating: (hasUserRating: boolean) => void,

		offerId: string,
		mensa: string,
		closeRatingModal: () => void
	}) => {

	const [userQualityRating, setUserQualityRating] = useState(userQualityRatingInitial)
	const [userAmountRating, setUserAmountRating] = useState(5)

	const sessionId = useRef(getItem("sessionId"))

	const saveRatings = () => {
		return new Promise((resolve, reject) => {
			setHasUserRating(true)
			setParentUserQualityRating(userQualityRating)
			setParentUserAmountRating(userAmountRating)
			
			const saveQuality = fetch("/api/qualityReview", {
				method: "POST",
				body: JSON.stringify({
					offer: offerId,
					qualityRatings,
					rating: userQualityRating,
					mensa,
					sessionId: sessionId.current
				})
			})
			const saveAmount = fetch("/api/amountReview", {
				method: "POST",
				body: JSON.stringify({
					offer: offerId,
					amountRatings,
					rating: userAmountRating,
					mensa,
					sessionId: sessionId.current
				})
			})
			Promise.all([saveQuality, saveAmount]).then((res) => {
				resolve(res)
			}).catch((err) => {
				reject(err)
			})
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

	const initiateClose = async () => {
		closeRatingModal()
	}

	const didMount = useRef(false)

	const timer = useRef(null)
	useEffect(() => {
		timer ? clearTimeout(timer.current) : null

		// Ignore first render
		if(didMount.current) {
			// User Changed Rating

			timer.current = setTimeout(() => {
				console.log("saving")
				sendToast()
			}, 1000)

		}

		didMount.current = true;

		return () => {
			clearTimeout(timer.current)
		}
	}, [userAmountRating, userQualityRating])

	const sendToast = () => {
		toast.promise(
			saveRatings(),
			{
				loading: "Speichern...",
				success: "Gespeichert.",
				error: "Fehler beim Speichern."
			},
			{
				position: "bottom-center",
				style: {
					border: '1px solid black'
				}
			}
		)
	}

	const {toasts} = useToasterStore()
	const TOAST_LIMIT = 1;

	useEffect(() => {
		toasts
		.filter((t) => t.visible) // Only consider visible toasts
		.filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit
		.forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) removal without animation
	}, [toasts])

	useEffect(() => {
		if (!sessionId.current) {
			const tempSessionId = makeId()
			console.log(tempSessionId)
			sessionId.current = tempSessionId
			setItem("sessionId", sessionId.current)
		}
		console.log(testRef)

		return () => {
			// Unloading and saving
			// sendToast()
		}
	}, [])

	const testRef = useRef(null)

	return (

			<div className='self-center relative bg-main-white w-full flex flex-col gap-4 rounded-tl-2xl rounded-tr-2xl px-8 py-10 mb-4 max-w-prose pointer-events-auto'>	
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
					<p ref={testRef} className="font-serif italic text-center" style={{
						transform: `translateX(calc(${(userAmountRating * 9)}% - ${testRef.current ? testRef.current.offsetWidth / 2 : 0}px + 18px))`
					}}>{
						userAmountRating >= 8 ? amountDescription[8] :
						userAmountRating >= 6 ? amountDescription[6] :
						userAmountRating >= 4 ? amountDescription[4] :
						userAmountRating >= 2 ? amountDescription[2] :
						userAmountRating >= 0 ? amountDescription[0] : ""
					}</p>
					{/* <p className="font-serif italic inline-flex" style={{
						transform: `translateX(clamp(0%, calc(${(userAmountRating * 9)}% - 22px), calc(100% - 80px)))`
					}}>{
						userAmountRating >= 8 ? amountDescription[8] :
						userAmountRating >= 6 ? amountDescription[6] :
						userAmountRating >= 4 ? amountDescription[4] :
						userAmountRating >= 2 ? amountDescription[2] :
						userAmountRating >= 0 ? amountDescription[0] : ""
					}</p> */}
				</div>
			</div>	

	)
}