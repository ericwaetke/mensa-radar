import { useState } from "react"

export const AmountRatingComponent = ({handleUserQualityRating, amountRating}) => {
	const amountOfStars = 5

	const userRatingColor = "#88E2A1"
	const ratingColor = "#000"
	const inactiveColor = "#DBDBDB"

	const testPosition = 0

	return (
		<div className="quality-rating-component">
			<p>
				Größe der Portion
			</p>
			<div className="quality-rating-component__body inline-flex my-2 py-2 px-4 bg-custom-white rounded-full border border-custom-divider items-center">
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

					<div className="w-4 h-4 bg-custom-black rounded-full absolute -top-0.5 border-2 border-custom-white"
					style={{
						left: `${testPosition * 90}%`,
						transform: `scale(${0.7 + testPosition / 2})`,
					}}>

					</div>
				</div>

				<svg className="ml-2" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M1.5 1.5L6 5.5L10.5 1.5" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
				</svg>

			</div>
			<p>
				Durchschnittlich
			</p>
		</div>
	)
}