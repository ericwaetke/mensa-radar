'use client';
import { useRef, useState, useEffect, use } from 'react';
import Link from 'next/link'
import 'tailwindcss/tailwind.css'
// import "../../assets/css/mensa.module.css"
import Modal from 'react-modal';

import { ObjectId } from 'mongodb';

import useSWR from 'swr';


import toast from "react-hot-toast"
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css'
import Head from 'next/head';
import { NutrientOverview } from '../../../../../components/nutrients/nutrientOverview';
import { Pill } from '../../../../../components/pill';
import { InteractiveRating } from '../../../../../components/ratings/interactiveRating/interactiveRating';
import { RatingOverview } from '../../../../../components/ratings/ratingOverview';
import { getItem } from '../../../../../lib/localStorageHelper';
import clientPromise from '../../../../../lib/mongodb';

const getMensaData = async (mensaUrl: string) => {
	const mensenReq = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/mensen?url=eq.${mensaUrl}&select=*`, {
		headers: {
			'apikey': process.env.SUPABASE_KEY,
			'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		next: {
			revalidate: 60*5
		}
	})
	let mensen = await mensenReq.json()
	return mensen
}

const getOffer = async (mensaUrl: string, offerId: number) => {
	const dev = process.env.NODE_ENV !== 'production';
	const mensenReq = await fetch(`${dev ? 'http://localhost:3000' : 'https://mensa-radar.de'}/api/getTempOffer`, {
		method: 'POST',
		body: JSON.stringify({
			mensaUrl,
			offerId
		}),
		next: {
			revalidate: 60*5
		}
	})
	let mensen = await mensenReq.json()

	return mensen
}

const getRatings: () => {qualityRatings: {sessionId: string, rating: 1|2|3}[], tagReviews: {tag?: string[]}} = async () => {
	return {}
}

export default function Mensa({params}) {
	const {mensa, offer} = params

	const offerData = use(getOffer(mensa, offer))
	console.log(offerData)
	const [hasUserRating, setHasUserRating] = useState(false)

	const [userQualityRating, setUserQualityRating] = useState<0|1|2|3>(0)
	const [userTagReviews, setUserTagReviews] = useState<string[]>([])

	const sessionId = useRef(getItem("sessionId"))

	// Modal Stuff
	const [showRatingModal, setShowRatingModal] = useState(false)
	const openRatingModal = () => {
		setShowRatingModal(true)
	}
	const closeRatingModal = () => {
		setShowRatingModal(false)
	}
	
	const ratings = use(getRatings())



	const checkRating = (rating, sessionId) => rating.sessionId == sessionId

	// Check if User has rated already
	if(ratings ? ratings?.qualityRatings?.some((rating) => checkRating(rating, sessionId.current)) : false) {
		setHasUserRating(true)
		setUserQualityRating(ratings.qualityRatings.find((rating) => checkRating(rating, sessionId.current)).rating)
	}



	const dev = process.env.NODE_ENV !== 'production';
	const imageUrl = `${dev ? 'http://localhost:3000' : 'https://mensa-radar.de'}/api/og?title=${offerData.beschreibung}`

	const mensaData = use(getMensaData(mensa))
	const mensaName = mensaData.filter(mensaFilter => mensaFilter.url === mensa)[0]?.name;

	return (
		<div className="space-y-6 break-words mx-5 mt-12 mb-28 lg:w-1/2 lg:mx-auto">
			<Head>
				<title>{offerData.beschreibung} - Mensa {mensaName}</title>
				<meta property='og:image' content={imageUrl} />
			</Head>
			<BottomSheet open={showRatingModal} onDismiss={() => setShowRatingModal(false)}>
				<InteractiveRating 
					qualityRatings={ratings ? ratings.qualityRatings : []} 
					userQualityRatingInitial={userQualityRating} 
					setParentUserQualityRating={setUserQualityRating} 

					tagReviews={ratings ? ratings.tagReviews : {}} 
					userTagReviewsInitial={userTagReviews}
					setParentUserTagReviews={setUserTagReviews}

					setHasUserRating={setHasUserRating}

					offerId={offerData._id} 
					mensa={mensa} 
					closeRatingModal={() => setShowRatingModal(false)}/>
									
				</BottomSheet>
			<div>
				<Link
					href={`/mensa/${mensa}/${params.day}/`}
					className="p-2 pl-0 flex items-center gap-4">

					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M11.1426 6.75C11.5568 6.75 11.8926 6.41421 11.8926 6C11.8926 5.58579 11.5568 5.25 11.1426 5.25V6.75ZM0.326533 5.46967C0.0336397 5.76256 0.0336397 6.23744 0.326533 6.53033L5.0995 11.3033C5.3924 11.5962 5.86727 11.5962 6.16016 11.3033C6.45306 11.0104 6.45306 10.5355 6.16016 10.2426L1.91752 6L6.16016 1.75736C6.45306 1.46447 6.45306 0.989592 6.16016 0.696699C5.86727 0.403806 5.3924 0.403806 5.0995 0.696699L0.326533 5.46967ZM11.1426 5.25L0.856863 5.25V6.75L11.1426 6.75V5.25Z" fill="black"/>
					</svg>
					<h2 className="text-sm font-medium inline text-center">Zurück zur Mensa {mensaName}</h2>

				</Link>

			</div>

			<div className="space-y-6 lg:space-y-4">
				<div className="flex-initial rounded-xl bg-background-container divide-y divide-solid divide-main-black/20">
					<div className="px-6 pt-7 pb-5">
						<p className="text-2xl font-bold">{offerData.beschreibung}</p>
						<div className="mt-9 flex justify-between flex-col xs:flex-row items-start gap-y-2">							
							<div className="font-medium text-black text-sm flex gap-2 items-center">
								<Pill>{offerData.preise.preis_s} €</Pill>
								<span className='text-gray-400'>{offerData.preise.preis_g} €</span>
							</div>

							{offerData.labels.filter !== "all" && <Pill>{offerData.labels.filter}</Pill>}
						</div>
					</div>

					<RatingOverview 
						ratingCount={ratings && ratings.qualityRatings ? ratings.qualityRatings.length : 0} 
						qualityRatings={ratings && ratings.qualityRatings ? ratings.qualityRatings : []} 
						tagReviews={ratings && ratings.tagReviews ? ratings.tagReviews : {}}
						
						hasUserRating={hasUserRating}
						userQualityRating={userQualityRating}
						userTagReviews={userTagReviews}/>
				</div>
				<div className='border border-sec-stroke rounded-xl divide-y divide-solid divide-background-container'>
					<NutrientOverview nutrients={offerData.nutrients} />

					<div className="py-4">
						<p className="px-8 pb-2 font-bold text-sm text-custom-black uppercase">Allergene</p>
						<div className="px-8 pb-4 text-sm font-serif">
								{offerData.allergene.join(", ")}
							</div>
					</div>
				</div>
				<button className='box-border flex fixed bottom-5 w-full left-0 justify-center' onClick={() => openRatingModal()}>
					<div className='mx-5 bg-main-green p-4 rounded-xl relative w-full flex justify-center'>
						<svg className='absolute left-5 top-0 h-full' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.55706 0.846068C9.74421 0.488621 10.2558 0.488621 10.443 0.846068L12.8792 5.49937C12.9497 5.6339 13.0774 5.72913 13.2265 5.75821L18.2594 6.73997C18.6417 6.81455 18.7957 7.27832 18.5339 7.56676L14.9933 11.4678C14.8954 11.5757 14.8494 11.721 14.8674 11.8656L15.5279 17.1685C15.5772 17.5637 15.1672 17.855 14.8102 17.6785L10.2216 15.4096C10.082 15.3405 9.91808 15.3405 9.7784 15.4096L5.18989 17.6785C4.8329 17.855 4.42287 17.5637 4.4721 17.1685L5.13267 11.8656C5.15068 11.721 5.1047 11.5757 5.00675 11.4678L1.46612 7.56676C1.20433 7.27832 1.35831 6.81455 1.74063 6.73997L6.77357 5.75821C6.92262 5.72913 7.05037 5.6339 7.12081 5.49937L9.55706 0.846068Z" fill='currentColor'></path>
						</svg>
						<div className='flex gap-4 items-center'>
							<p className='text-xl text-main-black opacity-20'>Wie wars?</p>
							<p className='text-xl text-main-black font-semibold'>Bewerten</p>
							<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M1 6.77588C0.447715 6.77588 4.82823e-08 7.22359 0 7.77588C-4.82823e-08 8.32816 0.447715 8.77588 1 8.77588L1 6.77588ZM16.7071 8.48299C17.0976 8.09246 17.0976 7.4593 16.7071 7.06877L10.3431 0.704812C9.95262 0.314288 9.31946 0.314288 8.92893 0.704812C8.53841 1.09534 8.53841 1.7285 8.92893 2.11903L14.5858 7.77588L8.92893 13.4327C8.53841 13.8233 8.53841 14.4564 8.92893 14.8469C9.31946 15.2375 9.95262 15.2375 10.3431 14.8469L16.7071 8.48299ZM1 8.77588L16 8.77588L16 6.77588L1 6.77588L1 8.77588Z" fill="#161616"/>
							</svg>
						</div>
					</div>
				</button>
			</div>
		</div>
	);
}
