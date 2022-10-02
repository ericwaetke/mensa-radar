import { AmountRatingComponent } from "./amountRatingComponent"
import { QualityRatingComponent } from "./qualityRatingComponent"

export const amountDescription = {
	0: "Keine Bewertungen",
	1: "Viel zu wenig",
	2: "Zu wenig",
	4: "Wie erwartet",
	6: "Viel",
	8: "Viel zu viel"
}

export const qualityDescriptions = {
	0: "Keine Bewertungen",
	1: "Schlecht",
	2: "Nicht soo super",
	3: "Durchschnittlich",
	4: "Gut",
	5: "Echt gut"
}

export const RatingOverview = (
	{
		ratingCount, 
		qualityRating,
		amountRating,

		hasUserRating,
		userQualityRating,
		userAmountRating,
	}) => {

	const ratingCountText = ratingCount === 1 ? "Bewertung" : "Bewertungen"

	return (
		<div className="py-4 px-8">
				<div className="flex justify-between">
					<QualityRatingComponent qualityRating={qualityRating} hasUserRating={hasUserRating} userQualityRating={userQualityRating}/>
					<AmountRatingComponent amountRating={amountRating} hasUserRating={hasUserRating} userAmountRating={userAmountRating}/>
				</div>
				<p className="text-sm font-serif italic opacity-50 my-2">
					{ratingCount} {ratingCountText}
				</p>
		</div>
	)
}