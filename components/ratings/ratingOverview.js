import { AmountRatingComponent } from "./amountRatingComponent"
import { QualityRatingComponent } from "./qualityRatingComponent"

export const RatingOverview = (
	{
		ratingCount, 
		handleUserQualityRating, 
		qualityRating,
		handleUserAmountRating, 
		amountRating,
		openRatingModal
	}) => {

	const ratingCountText = ratingCount === 1 ? "Bewertung" : "Bewertungen"

	return (
		<div className="py-4 px-8">
				<div className="flex justify-between" onClick={openRatingModal}>
					<QualityRatingComponent handleUserQualityRating={handleUserQualityRating} qualityRating={qualityRating}/>
					<AmountRatingComponent handleUserAmountRating={handleUserAmountRating} amountRating={amountRating}/>
				</div>
				<p className="text-sm font-serif italic opacity-50 my-2">
					{ratingCount} {ratingCountText}
				</p>
		</div>
	)
}