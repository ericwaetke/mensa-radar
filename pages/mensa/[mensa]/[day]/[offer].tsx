import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
import 'tailwindcss/tailwind.css'
import Footer from '../../../../components/footer';
// import "../../assets/css/mensa.module.css"
import Modal from 'react-modal';

import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb';
import { NutrientOverview } from '../../../../components/nutrients/nutrientOverview';
import { RatingOverview } from '../../../../components/ratings/ratingOverview';
import { mensaClearName } from '../../../../lib/mensaClearName';
import {calculateAverage} from "../../../../lib/calculateAverage"
import { InteractiveRating } from '../../../../components/ratings/interactiveRating/interactiveRating';
import useSWR from 'swr';


import toast from "react-hot-toast"

const fetcher = ({url, args}) => fetch(url, {method: "post", body: JSON.stringify(args)}).then((res) => res.json()).catch((err) => console.log(err))

export default function Mensa(props) {
	const router = useRouter()
  	const mensa = router.query.mensa as string

	const offer = props.offer ? props.offer : {
		title: "loading",
		beschreibung: "loading",
		preise: {
			preis_g: "loading",
			preis_s: "loading",
		},
		labels: {
			filter: "loading",
		},
		allergene: ["loading"],
		nutrients: [
			{
				name: "Fett",
			reference: 66,
			unit: "g"
			}
		]
	};

	const [ratings, setRatings] = useState<{qualityRatings: {sessionId: string,rating: number}[], amountRatings: {sessionId: string,rating: number}[]}>()

	const [hasUserRating, setHasUserRating] = useState(false)
	const [qualityRating, setQualityRating] = useState(0)
	const [amountRating, setAmountRating] = useState(0)

	const [userQualityRating, setUserQualityRating] = useState(0)
	const [userAmountRating, setUserAmountRating] = useState(0)

	// Modal Stuff
	const [showRatingModal, setShowRatingModal] = useState(false)
	const openRatingModal = () => {
		setShowRatingModal(true)
	}
	const closeRatingModal = () => {
		setShowRatingModal(false)
	}
	
	// const {data, error} = useSWR(`/api/getRatings?mensa=${mensa}&offerId=$`, fetcher)
	const {data, error} = useSWR({url: "/api/getRatings", args: {mensa, offerId: offer._id}}, fetcher)

	useEffect(() => {
		console.log("ratings", ratings)
		setRatings(data)
	}, [data])

	useEffect(() => {
		setQualityRating(ratings ? (ratings.qualityRatings ? calculateAverage(ratings.qualityRatings) : 0) : 0)
		setAmountRating(ratings ? (ratings.amountRatings ? calculateAverage(ratings.amountRatings) : 0) : 0)
	}, [ratings])

	return (
        <div className="space-y-6 break-words mx-5 mt-12 mb-28 lg:w-1/2 lg:mx-auto">
			<Modal
				isOpen={showRatingModal}
				onRequestClose={() => setShowRatingModal(false)}
				className="modal  z-10"
				overlayClassName=""
				ariaHideApp={false}
				shouldCloseOnOverlayClick={true}
				style={{
					overlay: {
						backgroundColor: 'rgba(0, 0, 0, 0.35)'
					}
				}}
			>
				<InteractiveRating 
					qualityRatings={ratings ? ratings.qualityRatings : []} 
					userQualityRatingInitial={userQualityRating} 
					setParentUserQualityRating={setUserQualityRating} 

					amountRatings={ratings ? ratings.amountRatings : []} 
					userAmountRatingInitial={userAmountRating}
					setParentUserAmountRating={setUserAmountRating}

					offerId={offer._id} 
					mensa={mensa} 
					closeRatingModal={() => setShowRatingModal(false)}/>
			</Modal>

			<div>
                <Link href={`/mensa/${mensa}/${router.query.day}/`}>
					<a className="p-6 pl-0 flex items-center gap-4">
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M11.1426 6.75C11.5568 6.75 11.8926 6.41421 11.8926 6C11.8926 5.58579 11.5568 5.25 11.1426 5.25V6.75ZM0.326533 5.46967C0.0336397 5.76256 0.0336397 6.23744 0.326533 6.53033L5.0995 11.3033C5.3924 11.5962 5.86727 11.5962 6.16016 11.3033C6.45306 11.0104 6.45306 10.5355 6.16016 10.2426L1.91752 6L6.16016 1.75736C6.45306 1.46447 6.45306 0.989592 6.16016 0.696699C5.86727 0.403806 5.3924 0.403806 5.0995 0.696699L0.326533 5.46967ZM11.1426 5.25L0.856863 5.25V6.75L11.1426 6.75V5.25Z" fill="black"/>
						</svg>
						<h2 className="text-sm font-medium inline text-center">Zurück zur Mensa {mensaClearName[mensa]}</h2>
					</a>
				</Link>

			</div>

			<div className="space-y-6 lg:space-y-4">
				<div className="flex-initial rounded-xl bg-background-container divide-y divide-solid divide-main-black/20">
					<div className="p-8">
						<p className="font-medium text-sm text-gray-400">{offer.titel}</p>
						<p className="text-2xl font-medium">{offer.beschreibung}</p>
						<div className="mt-9 flex justify-between flex-col xs:flex-row items-start gap-y-2">
							<p className="font-medium text-gray-400 text-sm"><span className="bg-main-white rounded-full py-1 px-4 text-black inline-block">{offer.preise.preis_s} €</span> <span className='text-green-w7'>{offer.preise.preis_g} €</span></p>
							{offer.labels.filter !== "all" && <p className="capitalize font-medium text-sm bg-main-white rounded-full py-1 px-4 inline-block">{offer.labels.filter}</p>}
						</div>
					</div>

					<RatingOverview 
						ratingCount={ratings && ratings.qualityRatings ? ratings.qualityRatings.length : 0} 
						qualityRating={qualityRating} 
						amountRating={amountRating} 
						openRatingModal={openRatingModal}/>
				</div>
				<div className='border border-sec-stroke rounded-xl divide-y divide-solid divide-background-container'>
					<NutrientOverview nutrients={offer.nutrients} />

					<div className="py-4" onClick={() => toast("test")}>
						<p className="px-8 pb-2 font-bold text-sm text-custom-black uppercase">Allergene</p>
						<div className="px-8 pb-4 text-sm font-serif">
								{offer.allergene.join(", ")}
							</div>
					</div>
				</div>
				<button className='flex fixed bottom-5 w-80 left-0 mx-8 bg-main-green justify-center p-4 rounded-xl' onClick={() => openRatingModal()}>
					<svg className='absolute left-5 top-0 h-full' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.55706 0.846068C9.74421 0.488621 10.2558 0.488621 10.443 0.846068L12.8792 5.49937C12.9497 5.6339 13.0774 5.72913 13.2265 5.75821L18.2594 6.73997C18.6417 6.81455 18.7957 7.27832 18.5339 7.56676L14.9933 11.4678C14.8954 11.5757 14.8494 11.721 14.8674 11.8656L15.5279 17.1685C15.5772 17.5637 15.1672 17.855 14.8102 17.6785L10.2216 15.4096C10.082 15.3405 9.91808 15.3405 9.7784 15.4096L5.18989 17.6785C4.8329 17.855 4.42287 17.5637 4.4721 17.1685L5.13267 11.8656C5.15068 11.721 5.1047 11.5757 5.00675 11.4678L1.46612 7.56676C1.20433 7.27832 1.35831 6.81455 1.74063 6.73997L6.77357 5.75821C6.92262 5.72913 7.05037 5.6339 7.12081 5.49937L9.55706 0.846068Z" fill='currentColor'></path>
					</svg>
					<div className='flex gap-4'>
						<p className='text-xl text-main-black opacity-20'>Wie wars?</p>
						<p className='text-xl text-main-black font-semibold'>Bewerten</p>
						<p>-&gt;</p>
					</div>
				</button>
			</div>
        </div>
    )
}

export async function getStaticPaths() {

	return {
		paths: [],
		fallback: true
	}
}

export async function getStaticProps(context) {
	try {
		const client = await clientPromise;
		const db = client.db("guckstDuEssen");

		console.log(context.params.mensa)
		const coll = await db.collection(context.params.mensa);
		console.log(coll)

        const offerQuery = {_id: new ObjectId(context.params.offer)}
		console.log(offerQuery)
        let offer = await coll.findOne(offerQuery).catch(err => console.log(err));

        offer._id = offer._id.toString()

        return {
            props: {
                offer
            }
        }
	} catch (e) {
		console.log("Error fetching Data")
		console.error(e)

        return {
            props: {
                offer: null
            }
        }
	}
}