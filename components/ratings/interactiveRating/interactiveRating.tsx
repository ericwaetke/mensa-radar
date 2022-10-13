import { useEffect, useRef, useState } from "react"
import { InteractiveQualityRatingComponent } from "./QualityRatingComponent"
import { getItem, setItem } from '../../../lib/localStorageHelper';
import { makeId } from '../../../lib/makeId';
import styles from "./InteractiveRating.module.css"
import { qualityDescriptions } from "../ratingOverview";
import { motion } from "framer-motion";
import useTimeout from "use-timeout";
import toast, { useToasterStore } from "react-hot-toast"
import { InteractiveTagComponent } from "./InteractiveTagComponent";

export const InteractiveRating = (
	{
		qualityRatings,
		userQualityRatingInitial, 
		setParentUserQualityRating,

		tagReviews,
		userAmountRatingInitial,
		setParentUserAmountRating,

		setHasUserRating,

		offerId,
		mensa,
		closeRatingModal
	}: 
	{
		qualityRatings: {sessionId: string, rating: number}[],
		userQualityRatingInitial: 0|1|2|3, 
		setParentUserQualityRating: (rating: 0|1|2|3) => void,

		tagReviews: {"?"?: string[]},
		userAmountRatingInitial: number,
		setParentUserAmountRating: (rating: number) => void,

		setHasUserRating: (hasUserRating: boolean) => void,

		offerId: string,
		mensa: string,
		closeRatingModal: () => void
	}) => {

	const [userQualityRating, setUserQualityRating] = useState(userQualityRatingInitial)
	const [userAmountRating, setUserAmountRating] = useState(userAmountRatingInitial)

	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const handleUserTagSelection = (tag: string) => {
		// Todo: Update Database with new tags

		if (selectedTags.includes(tag)) {
			setSelectedTags(selectedTags.filter(t => t !== tag))
		} else {
			setSelectedTags([...selectedTags, tag])
		}
	} 

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
			const saveAmount = fetch("/api/tagReview", {
				method: "POST",
				body: JSON.stringify({
					mensa,
					offerId,
					tagReviews,

					sessionId: sessionId.current,
					tags: selectedTags,
				})
			})
			Promise.all([saveQuality, saveAmount]).then((res) => {
				resolve(res)
			}).catch((err) => {
				reject(err)
			})
		})
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
					<label>Wie beschreibst du das Essen?</label>
					<InteractiveTagComponent qualityRating={userQualityRating} selected={selectedTags} handleUserTagSelection={handleUserTagSelection}/>
				</div>
			</div>	

	)
}