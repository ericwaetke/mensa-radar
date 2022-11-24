import { createClient } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChangeEvent, useState } from "react"
import { NutrientOverview } from "./nutrients/nutrientOverview"
import { Pill } from "./pill"
import { RatingOverview } from "./ratings/ratingOverview"

import Modal from "react-modal"
Modal.setAppElement('#__next');
import { CaptureImage } from "./imageFlow/CaptureImage"
import RateFood from "./ratings/RateFood"
import { Allergens } from "./allergens"

export const Offer = (
	{
		offer,
		
		mensa,
		day,
		reff
	}: {
		offer: {
			id: number,
			mensa: number,
			food_title: string,
			food_desc: string,
			vegan: boolean,
			vegetarian: boolean,
			nutrients: {
				name: string,
				value: string,
				unit: string,
			}[],
			allergens: string[]
			date: string,
			price_students: number,
			price_other: number,
			sold_out: boolean,

			imageUrls: string[],
		},
		mensa: string | string[],
		day: string | string[],
		reff: any
	}
) => {
	
	const containerAnimation = {
		hidden: {
			opacity: 0,
		},
		show: {
			opacity: 1,
			transition: {
				staggerChildren: .2,
				delayChildren: .1
			}
		}
	}
	const dayVariantAnimation = {
		hidden: {
			opacity: 0,
			y: 20
		},
		show: {
			opacity: 1,
			y: 0,
		}
	}

	const anim02 = {
		hidden: {
			opacity: 0,
			y: 20
		},
		show: {
			opacity: 1,
			y: 0,
		}
	}

	const formatter = new Intl.NumberFormat('de-DE', {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: 2
	})

	const [modalOpen, setModalOpen] = useState(false);
	const [currentModalContent, setCurrentModalContent] = useState("");

	const openImageFlow = () => {
		setCurrentModalContent("image");
		setModalOpen(true);
	}
	const openRatingFlow = () => {
		setCurrentModalContent("rating");
		setModalOpen(true);
	}

	const customStyles = {
		content: {
			top: 0,
			left: 0,
			height: "100%",
			width: "100%",
			border: "none",
			borderRadius: 0,
			inset: 0,
			padding: 0
		},
	};
	  
	const [tempImage, setTempImage] = useState("");

	return (
		<>
		<Modal
			isOpen={modalOpen}
			onRequestClose={() => setModalOpen(false)}
			style={customStyles}
			>
			{
				currentModalContent == "image" ? <>
					<CaptureImage 
						setModalOpen={setModalOpen} 
						setCurrentModalContent={setCurrentModalContent}
						setTempImage={setTempImage} 
						
						foodTitle={offer.food_title}
						foodId={offer.id}/>
				</> : currentModalContent === "rating" ? <>
					<RateFood
						setModalOpen={setModalOpen}
						setCurrentModalContent={setCurrentModalContent}

						foodTitle={offer.food_title}
						foodId={offer.id}
						/>
				</> : <></>
			}
		</Modal>
		<motion.div 
			className={`inline-block snap-center first:snap-start last:snap-end first:pl-4 last:pr-4 sm:first:p-0 sm:last:p-0`}
			variants={containerAnimation}
			initial="hidden"
			animate="show"
			>

			<div ref={reff} className={`w-92 min-height-96 h-full overflow-hidden rounded-2xl bg-white  ease-in-out p-3 flex flex-col justify-between ${offer.sold_out ? "opacity-50" : ""}`}>
				<div className="flex-col space-y-3 mb-auto">
				{
					offer.imageUrls.length > 0 || tempImage != "" ? <div className="w-full h-44 bg-gray rounded-xl">
						{
							tempImage !== "" ? <img src={tempImage} className="w-full h-full object-cover rounded-xl" /> : <img src={offer.imageUrls[offer.imageUrls.length-1]} className="w-full h-full object-cover rounded-xl" />
						}
					</div> : null
				}
					
					<h2 className="text-h2 font-serif-semi px-4 pt-3">
						{offer.food_title}
					</h2>

					<Allergens allergens={offer.allergens}/>
				</div>
				<div className="flex flex-col space-y-6">
					<div className="px-4 flex-col space-y-2">
						<div className="flex flex-row space-x-2">
							<div className="inline-flex flex-row space-x-1.5 px-3 py-1 border border-gray/20 rounded-full font-sans-reg text-sm">
								<p>{formatter.format(offer.price_students)}</p>
								<p className="text-gray/50">·</p>
								<p className="text-gray/50">{formatter.format(offer.price_other)}</p>
							</div>
							{
								offer.vegan ? <>
									<div className="inline-flex flex-row space-x-1 px-3 pl-2 py-1 bg-main-green items-center rounded-full font-sans-reg text-sm">
										<img src="/icons/vegan.svg" className="w-4"></img>
										<p>vegan</p>
									</div>
								</> : offer.vegetarian ? <>
									<div className="inline-flex flex-row space-x-1 px-3 pl-2 py-1 bg-main-green items-center rounded-full font-sans-reg text-sm">
										<img src="/icons/vegan.svg" className="w-4"></img>
										<p>vegetarisch</p>
									</div>

								</> : offer.sold_out? <>
									<div className="inline-flex flex-row space-x-1 px-3 pl-2 py-1 bg-main-green items-center rounded-full font-sans-reg text-sm">
										<p>😢</p>
										<p>Ausverkauft</p>
									</div>
								</> :
								null
							}
							
							
						</div>
						{/* TODO: Rating */}
						{/* 
						 </br> <div className="inline-flex  flex-row space-x-1 px-3 py-1 border border-gray/20 rounded-full font-sans-reg text-sm">
							<p>😕 2,4 / 5</p>
							<p className="text-gray/50">·</p>
							<p className="text-gray/50">3 Bewertungen</p>
						</div> */}
						
					</div>
					<div className="flex space-x-2 sm:space-x-0 w-full">
						<button 
						className="p-3 px-8 w-full rounded-lg flex items-center justify-center border-gray/20 border space-x-2 overflow-hidden whitespace-nowrap sm:hidden"
						onClick={() => openImageFlow()}>
							<img src="/icons/camera.png" className="w-5" />
							<p className="font-sans-med">Fotografieren</p>
						</button>
						<button 
						className="p-3 px-8 rounded-lg flex items-center justify-center border-gray/20 border space-x-2 sm:w-full"
						onClick={() => openRatingFlow()}>
							<img src="/icons/star.png" className="w-5" />
							<p className="font-sans-med">Bewerten</p>
						</button>
					</div>
				</div>
			</div>
		</motion.div>
		</>
	)
}