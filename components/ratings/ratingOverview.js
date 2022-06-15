import { QualityRatingComponent } from "./qualityRatingComponent"

export const RatingOverview = ({ratingCount, handleUserQualityRating, qualityRating, userQualityRating}) => {

    const ratingCountText = ratingCount === 1 ? "Bewertung" : "Bewertungen"

    return (
        <div className="py-4 px-8">
                <QualityRatingComponent handleUserQualityRating={handleUserQualityRating} qualityRating={qualityRating} userQualityRating={userQualityRating}/>

                <p className="text-sm font-serif italic opacity-50 my-2">
                    {ratingCount} {ratingCountText}
                </p>
        </div>
    )
}