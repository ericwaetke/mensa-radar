import { useState } from "react"
import { qualityDescriptions } from "./ratingOverview"
import { motion } from "framer-motion";
import { Pill } from "../pill";

export const ReviewTagsComponent = (
	{
		tagReviews, 

		hasUserRating,
		userTagReviews
	}: {
		tagReviews: {"?"?: string[]},

		hasUserRating: boolean,
		userTagReviews: string[],
	}) => {

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

	return (
		<div className="quality-rating-component inline-flex flex-col">
			<motion.div className="quality-rating-component__body inline-flex my-2 items-center"
			variants={container}
			initial="hidden"
			animate="show">
				{
					Object.keys(tagReviews).map((tag, index) => {
						return (
							<Pill>
								{tag} <span className="bg-background-container rounded-full w-4 h-4 flex justify-center">{tagReviews[tag].length}</span>
							</Pill>
						)
					})
				}
			</motion.div>
		</div>
	)
}