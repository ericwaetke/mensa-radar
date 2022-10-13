import { QualityRatingComponent } from "./qualityRatingComponent"
import { ReviewTagsComponent } from "./reviewTagsComponent"

export const qualityDescriptions = {
	0: "Keine Bewertungen",
	1: "Schlecht",
	2: "Okayyyy",
	3: "Sehr Gut",
}

export const RatingOverview = (
	{
		ratingCount, 
		qualityRatings,
		tagReviews,

		hasUserRating,
		userQualityRating,
		userTagReviews,
	}: {
		ratingCount: number,
		qualityRatings: {sessionId: string, rating: 0|1|2|3}[],
		tagReviews: {"?"?: string[]},

		hasUserRating: boolean,
		userQualityRating: 0|1|2|3,
		userTagReviews: string[],

	}) => {

	const ratingCountText = ratingCount === 1 ? "Bewertung" : "Bewertungen"

	return (
		<div className="py-4 px-8">
				<div className="flex justify-between">
					<QualityRatingComponent qualityRatings={qualityRatings} hasUserRating={hasUserRating} userQualityRating={userQualityRating}/>
					<ReviewTagsComponent tagReviews={tagReviews} hasUserRating={hasUserRating} userTagReviews={userTagReviews}/>
				</div>
				<p className="text-sm font-serif italic opacity-50 my-2">
					{ratingCount} {ratingCountText}
				</p>
		</div>
	)
}