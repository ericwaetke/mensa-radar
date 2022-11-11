import { createClient } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChangeEvent, useState } from "react"
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
	const [tempImage, setTempImage] = useState("")
	const [uploading, setUploading] = useState(false)

	const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		let file;
	
		if (e.target.files) {
		  file = e.target.files[0];
		}

		setTempImage(URL.createObjectURL(file))
		setUploading(true)

		// Generate a random name for the file with 12 characters
		const fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
		const supabase = createClient(supabaseUrl, supabaseKey)

		const { data, error } = await supabase.storage
		  .from("food-images")
		  .upload(fileName, file as File);
	
		if (data) {
		  // Add the image name to the database
		  const { data: imageData, error: imageError } = await supabase
			.from('food_images')
			.insert({
				food_id: offer.id,
				image_name: fileName
			})

			setUploading(false)
			if (imageData) {
				console.log(imageData)
			} else if (imageError) {
				console.log(imageError)
				setUploading(false)
			}
		} else if (error) {
		  console.log(error);
		}
	};

	const formatter = new Intl.NumberFormat('de-DE', {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: 2
	})


	return (
		<motion.div 
			className={`my-4 p-5 flex flex-col gap-8 rounded-xl bg-background-container justify-between snap-start ${offer.soldOut ? "opacity-50" : ""}`}
			variants={containerAnimation}
			initial="hidden"
			animate="show">
			{/* <p className="font-medium text-sm text-gray-400">{offer.titel}</p> */}
			<div className='flex-initial w-full'>
				{
					// Show first image
					offer.imageUrls.length > 0 ? (
						<img src={offer.imageUrls[0]} className="w-full rounded-xl" />
					) : <motion.div layout transition={{duration: 2}} className="relative rounded-xl overflow-hidden">
						{uploading ? (
							<div className="absolute flex justify-center items-center w-full h-full bg-sky-500/[.9]">
								<svg aria-hidden="true" className="inline mr-2 w-8 h-8 text-gray-200 animate-spin fill-green-500" viewBox="0 0 100 101" fill="#88E2A1" xmlns="http://www.w3.org/2000/svg">
									<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
									<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
								</svg>
								<span className="sr-only">Loading...</span>
							</div>
						) : null}
						{tempImage !== "" ? <motion.img layout src={tempImage} className="w-full" initial={{scale: 0}} animate={{scale: 1}} /> : null}
					</motion.div>

				}
				<motion.p layout variants={dayVariantAnimation} className="text-2xl font-bold">{offer.food_title}</motion.p>
				
			</div>

			{/* <RatingOverview offerId={offer.id}/>
			<NutrientOverview nutrients={offer.nutrients} /> */}

			<div className="pb-4 text-sm font-serif">
				{offer.allergens.join(", ")}
			</div>

			<div className="mt-5 flex flex-wrap flex-row items-start gap-y-2">
				{
					//Pills
					
					offer.soldOut ? (
						<Pill>
							😔 Ausverkauft
						</Pill>
					) : (
						<>
							<motion.div variants={dayVariantAnimation} className="font-medium text-black text-sm flex gap-2 items-center">
								<Pill>
									{formatter.format(offer.price_students)} 
									<span className='text-gray-400 min-w-max'> · {formatter.format(offer.price_other)}</span>
								</Pill>
								{
									offer.vegan ? <Pill className="bg-main-green">vegan</Pill> : offer.vegetarian ? <Pill>vegetarisch</Pill> : null
								}
							</motion.div>
						</>
					)
				}
			</div>

			<div className="flex gap-2 justify-between">
				<label htmlFor="file_input" className="h-14 w-full min-w-max grow border-2 rounded-lg flex justify-center items-center gap-2 cursor-pointer px-4">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
					<p>
						Foto aufnehmen
					</p>
				</label>
				<input
					type="file"
					accept="image/*"
					className="hidden"
					id="file_input"
					onChange={(e) => {
						handleUpload(e); // 👈 this will trigger when user selects the file.
					}}
				/>

				<button className="h-14 w-full border-2 rounded-lg flex justify-center items-center cursor-pointer px-4">
					<p>
						Bewerten
					</p>
				</button>
			</div>
		</motion.div>
	)
}