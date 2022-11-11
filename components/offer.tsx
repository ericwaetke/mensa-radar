import { createClient } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChangeEvent } from "react"
import { supabase } from "../lib/getSupabaseClient"
import { NutrientOverview } from "./nutrients/nutrientOverview"
import { Pill } from "./pill"
import { RatingOverview } from "./ratings/ratingOverview"

export const Offer = (
	{
		offer,
		
		mensa,
		day
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

	const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		let file;
	
		if (e.target.files) {
		  file = e.target.files[0];
		}

		// Generate a random name for the file with 12 characters
		const fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
		const supabase = createClient(supabaseUrl, supabaseKey)

		const { data, error } = await supabase.storage
		  .from("food-images")
		  .upload(fileName, file as File);
	
		if (data) {
		  console.log(data);

		  // Add the image name to the database
		  const { data: imageData, error: imageError } = await supabase
			.from('food_images')
			.insert({
				food_id: offer.id,
				image_name: fileName
			})

			if (imageData) {
				console.log(imageData)
			} else if (imageError) {
				console.log(imageError)
			}

		} else if (error) {
		  console.log(error);
		}
	  };

	return (
		<div className={`my-4 p-5 flex flex-col gap-8 rounded-xl bg-background-container justify-between snap-start ${offer.soldOut ? "opacity-50" : ""}`}>
			{/* <p className="font-medium text-sm text-gray-400">{offer.titel}</p> */}
			<motion.div className='flex-initial w-full'
			variants={containerAnimation}
			initial="hidden"
			animate="show">
				{
					// Map over the images
					offer.imageUrls.map((image, index) => {
						return (
							<motion.div key={index} variants={dayVariantAnimation}>
								<img src={image} alt="food" className="w-full rounded-xl" />
							</motion.div>
						)
					})
				}
				<motion.p variants={dayVariantAnimation} className="text-2xl font-bold">{offer.food_title}</motion.p>
				<div className="mt-5 flex justify-between flex-wrap flex-row items-start gap-y-2">
					{
						offer.soldOut ? (
							<Pill>
								😔 Ausverkauft
							</Pill>
						) : (
							<>
								<motion.div variants={dayVariantAnimation} className="font-medium text-black text-sm flex gap-2 items-center">
									<Pill>{offer.price_students} €</Pill>
									<span className='text-gray-400 min-w-max'>{offer.price_other} €</span>
								</motion.div>
								<motion.div variants={dayVariantAnimation} className='flex gap-2 justify-end'>
									{offer.qualityRating && <Pill>
										<svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M9.55706 0.846068C9.74421 0.488621 10.2558 0.488621 10.443 0.846068L12.8792 5.49937C12.9497 5.6339 13.0774 5.72913 13.2265 5.75821L18.2594 6.73997C18.6417 6.81455 18.7957 7.27832 18.5339 7.56676L14.9933 11.4678C14.8954 11.5757 14.8494 11.721 14.8674 11.8656L15.5279 17.1685C15.5772 17.5637 15.1672 17.855 14.8102 17.6785L10.2216 15.4096C10.082 15.3405 9.91808 15.3405 9.7784 15.4096L5.18989 17.6785C4.8329 17.855 4.42287 17.5637 4.4721 17.1685L5.13267 11.8656C5.15068 11.721 5.1047 11.5757 5.00675 11.4678L1.46612 7.56676C1.20433 7.27832 1.35831 6.81455 1.74063 6.73997L6.77357 5.75821C6.92262 5.72913 7.05037 5.6339 7.12081 5.49937L9.55706 0.846068Z" fill="#161616"/>
										</svg>
										</Pill>}
										{
											offer.vegan ? <Pill>Vegan</Pill> : offer.vegetarian ? <Pill>Vegetarisch</Pill> : null
										}
								</motion.div>
							</>
						)
					}
				</div>
			</motion.div>
			<RatingOverview offerId={offer.id}/>
			<NutrientOverview nutrients={offer.nutrients} />
			<div className="pb-4 text-sm font-serif">
				{offer.allergens.join(", ")}
			</div>
			<input
				type="file"
				accept="image/*"
				className="block w-auto text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
				id="file_input"
				onChange={(e) => {
					handleUpload(e); // 👈 this will trigger when user selects the file.
				}}
			/>
		</div>
	)
}