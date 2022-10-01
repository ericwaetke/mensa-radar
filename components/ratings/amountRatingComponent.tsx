import { useState } from "react"
import { amountDescription } from "./ratingOverview"

export const AmountRatingComponent = (
	{
		amountRating,

		hasUserRating,
		userAmountRating,
	}: {
		amountRating: number,

		hasUserRating: boolean,
		userAmountRating: number
	}
	) => {
	const amountOfStars = 5

	const userRatingColor = "#88E2A1"
	const ratingColor = "#000"
	const inactiveColor = "#DBDBDB"

	const testPosition = 0

	return (
		<div className="quality-rating-component inline-flex flex-col gap-3">
			<label className="uppercase text-sm font-bold">Größe der Portion</label>
			<div className="quality-rating-component__body inline-flex items-center">
				<div className="relative">
					<svg width="123" height="13" viewBox="0 0 123 13" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 6.43602C0 5.35675 0.856301 4.47215 1.93499 4.43707L120.935 0.567155C122.064 0.530425 123 1.43605 123 2.5661V10.4339C123 11.5639 122.064 12.4696 120.935 12.4328L1.935 8.56293C0.856305 8.52785 0 7.64325 0 6.56398V6.43602Z" fill="url(#paint0_linear_465_656)"/>
						<defs>
						<linearGradient id="paint0_linear_465_656" x1="2.48485" y1="6.5" x2="121.758" y2="6.50001" gradientUnits="userSpaceOnUse">
						<stop stop-color="#DBDBDB"/>
						<stop offset="0.5" stop-color="#88E2A1"/>
						<stop offset="1" stop-color="#DBDBDB"/>
						</linearGradient>
						</defs>
					</svg>

					{
						hasUserRating ? (
							<div className="w-4 h-4 bg-main-black rounded-full absolute -top-0.5 border-2 border-background-container"
							style={{
								left: `${userAmountRating * 9}%`,
								transform: `scale(${0.7 + userAmountRating / 20})`,
							}}></div>
						) : (
							<div className="w-2 h-6 bg-main-black rounded-full absolute -top-1 border-2 border-background-container"
							style={{
								left: `${amountRating * 9}%`,
							}}></div>
						)
					}

					
				</div>
			</div>
			<p className="text-sm font-serif">
				{
					(hasUserRating ? userAmountRating : amountRating) >= 8 ? amountDescription[8] :
					(hasUserRating ? userAmountRating : amountRating) >= 6 ? amountDescription[6] :
					(hasUserRating ? userAmountRating : amountRating) >= 4 ? amountDescription[4] :
					(hasUserRating ? userAmountRating : amountRating) >= 2 ? amountDescription[2] :
					(hasUserRating ? userAmountRating : amountRating) >= 0 ? amountDescription[0] : ""
				}
			</p>
		</div>
	)
}