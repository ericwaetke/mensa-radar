import { useState } from "react"
import { qualityDescriptions } from "./ratingOverview"
import { motion } from "framer-motion";
import { Pill } from "../pill";

export const QualityRatingComponent = (
	{
		qualityRatings, 

		hasUserRating,
		userQualityRating
	}: {
		qualityRatings: {sessionId: string, rating: 0|1|2|3}[],

		hasUserRating: boolean,
		userQualityRating: number
	}) => {
	const amountOfStars = 5

	const userRatingColor = "#88E2A1"
	const ratingColor = "#000"
	const inactiveColor = "#DBDBDB"

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 1
			}
		}
	}
	const starAnimation = {
		hidden: { opacity: 0, scale: 0 },
		show: {
			opacity: 1,
			scale: 1,
		}
	}

	const userStarAnimation = {
		hidden: { opacity: 0, scale: 0 },
		show: {
			opacity: 1,
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 260,
				damping: 20,
				velocity: 100
			}
		}
	}

	const negativeRating = qualityRatings.filter(rating => rating.rating === 1).length
	const neutralRating = qualityRatings.filter(rating => rating.rating === 2).length
	const positiveRating = qualityRatings.filter(rating => rating.rating === 3).length

	return (
		<div className="quality-rating-component inline-flex flex-col">
			<motion.div className="quality-rating-component__body inline-flex my-2 items-center"
			variants={container}
			initial="hidden"
			animate="show">
				{
					positiveRating > 0 ? <Pill>
						<svg className="h-3 w-3" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 30">
							<path d="M.94 20.18c0 1.38.26 2.65.78 3.81a7.02 7.02 0 0 0 2.14 2.77 4.9 4.9 0 0 0 3.09 1.04h2.71a7.92 7.92 0 0 1-2.83-3.34c-.58-1.34-.88-2.8-.88-4.4a11.72 11.72 0 0 1 1.4-5.71c.39-.72.77-1.33 1.15-1.83H6.44a4.3 4.3 0 0 0-2.82 1.03 6.79 6.79 0 0 0-1.96 2.75 10.04 10.04 0 0 0-.72 3.88Zm6.73-.11a8.47 8.47 0 0 0 2.81 6.46 9.66 9.66 0 0 0 3.33 1.9c1.3.46 2.75.69 4.38.69h1.9c.9 0 1.69-.03 2.34-.09A8.27 8.27 0 0 0 24 28.8a3.97 3.97 0 0 0 1.48-.73c.45-.36.67-.86.67-1.53 0-.27-.03-.5-.1-.7a2.2 2.2 0 0 0-.22-.53c-.12-.2-.1-.33.08-.4.43-.18.81-.47 1.12-.86.32-.39.47-.86.47-1.4 0-.64-.16-1.17-.5-1.59-.16-.22-.12-.4.14-.54.3-.18.56-.46.76-.82a2.91 2.91 0 0 0 .13-2.2c-.1-.3-.24-.55-.41-.71-.19-.17-.17-.35.06-.55.2-.18.37-.43.5-.73a2.6 2.6 0 0 0-.12-2.28c-.22-.38-.5-.68-.88-.9a2.28 2.28 0 0 0-1.23-.33H21c-.61 0-1.12-.15-1.5-.44-.39-.3-.58-.72-.58-1.23 0-.47.12-1.02.35-1.66.24-.63.51-1.3.82-2 .32-.72.59-1.43.82-2.13a6.4 6.4 0 0 0 .36-2c0-.65-.19-1.15-.56-1.5A1.85 1.85 0 0 0 19.36.5c-.51 0-.91.15-1.2.47-.29.3-.57.73-.84 1.26a36.24 36.24 0 0 1-3.47 5.53 598.25 598.25 0 0 0-3.5 4.59c-.6.79-1.1 1.57-1.5 2.34a9.9 9.9 0 0 0-.89 2.45c-.2.86-.3 1.83-.3 2.93Z" fill="#000"/>
						</svg>
						sehr gut 
						<span className="bg-background-container rounded-full w-4 h-4 flex justify-center">{positiveRating}</span>
					</Pill> : null
				}
				{
					neutralRating > 0 ? <Pill>
						<svg className="h-3 w-3 transform -rotate-90" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 30">
							<path d="M.94 20.18c0 1.38.26 2.65.78 3.81a7.02 7.02 0 0 0 2.14 2.77 4.9 4.9 0 0 0 3.09 1.04h2.71a7.92 7.92 0 0 1-2.83-3.34c-.58-1.34-.88-2.8-.88-4.4a11.72 11.72 0 0 1 1.4-5.71c.39-.72.77-1.33 1.15-1.83H6.44a4.3 4.3 0 0 0-2.82 1.03 6.79 6.79 0 0 0-1.96 2.75 10.04 10.04 0 0 0-.72 3.88Zm6.73-.11a8.47 8.47 0 0 0 2.81 6.46 9.66 9.66 0 0 0 3.33 1.9c1.3.46 2.75.69 4.38.69h1.9c.9 0 1.69-.03 2.34-.09A8.27 8.27 0 0 0 24 28.8a3.97 3.97 0 0 0 1.48-.73c.45-.36.67-.86.67-1.53 0-.27-.03-.5-.1-.7a2.2 2.2 0 0 0-.22-.53c-.12-.2-.1-.33.08-.4.43-.18.81-.47 1.12-.86.32-.39.47-.86.47-1.4 0-.64-.16-1.17-.5-1.59-.16-.22-.12-.4.14-.54.3-.18.56-.46.76-.82a2.91 2.91 0 0 0 .13-2.2c-.1-.3-.24-.55-.41-.71-.19-.17-.17-.35.06-.55.2-.18.37-.43.5-.73a2.6 2.6 0 0 0-.12-2.28c-.22-.38-.5-.68-.88-.9a2.28 2.28 0 0 0-1.23-.33H21c-.61 0-1.12-.15-1.5-.44-.39-.3-.58-.72-.58-1.23 0-.47.12-1.02.35-1.66.24-.63.51-1.3.82-2 .32-.72.59-1.43.82-2.13a6.4 6.4 0 0 0 .36-2c0-.65-.19-1.15-.56-1.5A1.85 1.85 0 0 0 19.36.5c-.51 0-.91.15-1.2.47-.29.3-.57.73-.84 1.26a36.24 36.24 0 0 1-3.47 5.53 598.25 598.25 0 0 0-3.5 4.59c-.6.79-1.1 1.57-1.5 2.34a9.9 9.9 0 0 0-.89 2.45c-.2.86-.3 1.83-.3 2.93Z" fill="#000"/>
						</svg>
						okayyyy 
						<span className="bg-background-container rounded-full w-4 h-4 flex justify-center">{neutralRating}</span>
					</Pill> : null
				}
				{
					negativeRating > 0 ? <Pill>
						<svg className="h-3 w-3 transform rotate-180" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 30">
							<path d="M.94 20.18c0 1.38.26 2.65.78 3.81a7.02 7.02 0 0 0 2.14 2.77 4.9 4.9 0 0 0 3.09 1.04h2.71a7.92 7.92 0 0 1-2.83-3.34c-.58-1.34-.88-2.8-.88-4.4a11.72 11.72 0 0 1 1.4-5.71c.39-.72.77-1.33 1.15-1.83H6.44a4.3 4.3 0 0 0-2.82 1.03 6.79 6.79 0 0 0-1.96 2.75 10.04 10.04 0 0 0-.72 3.88Zm6.73-.11a8.47 8.47 0 0 0 2.81 6.46 9.66 9.66 0 0 0 3.33 1.9c1.3.46 2.75.69 4.38.69h1.9c.9 0 1.69-.03 2.34-.09A8.27 8.27 0 0 0 24 28.8a3.97 3.97 0 0 0 1.48-.73c.45-.36.67-.86.67-1.53 0-.27-.03-.5-.1-.7a2.2 2.2 0 0 0-.22-.53c-.12-.2-.1-.33.08-.4.43-.18.81-.47 1.12-.86.32-.39.47-.86.47-1.4 0-.64-.16-1.17-.5-1.59-.16-.22-.12-.4.14-.54.3-.18.56-.46.76-.82a2.91 2.91 0 0 0 .13-2.2c-.1-.3-.24-.55-.41-.71-.19-.17-.17-.35.06-.55.2-.18.37-.43.5-.73a2.6 2.6 0 0 0-.12-2.28c-.22-.38-.5-.68-.88-.9a2.28 2.28 0 0 0-1.23-.33H21c-.61 0-1.12-.15-1.5-.44-.39-.3-.58-.72-.58-1.23 0-.47.12-1.02.35-1.66.24-.63.51-1.3.82-2 .32-.72.59-1.43.82-2.13a6.4 6.4 0 0 0 .36-2c0-.65-.19-1.15-.56-1.5A1.85 1.85 0 0 0 19.36.5c-.51 0-.91.15-1.2.47-.29.3-.57.73-.84 1.26a36.24 36.24 0 0 1-3.47 5.53 598.25 598.25 0 0 0-3.5 4.59c-.6.79-1.1 1.57-1.5 2.34a9.9 9.9 0 0 0-.89 2.45c-.2.86-.3 1.83-.3 2.93Z" fill="#000"/>
						</svg>
						schlecht 
						<span className="bg-background-container rounded-full w-4 h-4 flex justify-center">{negativeRating}</span>
					</Pill> : null
				}
			</motion.div>
		</div>
	)
}