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
import { InteractiveRating } from '../../../../components/ratings/interactiveRating';
import useSWR from 'swr';

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
        <div className="space-y-6 break-words mx-5 mt-12">
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

			<div className="space-y-6 lg:space-y-0">
				<div className="flex-initial rounded-xl bg-custom-bg divide-y divide-solid divide-custom-divider">
					<div className="p-8">
						<p className="font-medium text-sm text-gray-400">{offer.titel}</p>
						<p className="text-2xl font-medium">{offer.beschreibung}</p>
						<div className="mt-9 flex justify-between flex-col xs:flex-row items-start gap-y-2">
							<p className="font-medium text-gray-400 text-sm"><span className="bg-custom-light-gray rounded-full py-1 px-4 text-black inline-block">{offer.preise.preis_s} €</span> <span className='text-green-w7'>{offer.preise.preis_g} €</span></p>
							{offer.labels.filter !== "all" && <p className="capitalize font-medium text-sm bg-custom-light-gray rounded-full py-1 px-4 inline-block">{offer.labels.filter}</p>}
						</div>
					</div>

					<RatingOverview 
						ratingCount={ratings && ratings.qualityRatings ? ratings.qualityRatings.length : 0} 
						qualityRating={qualityRating} 
						amountRating={amountRating} 
						openRatingModal={openRatingModal}/>
					<NutrientOverview nutrients={offer.nutrients} />

					<div className="py-4">
						<p className="px-8 pb-2 font-bold text-sm text-custom-black uppercase">Allergene</p>
						<div className="px-8 pb-4 text-sm font-serif">
								{offer.allergene.join(", ")}
							</div>
					</div>
				</div>
				<div className='flex items-center gap-2'>
					<p>Bitte stimmt nach dem Essen ab.</p>
					<svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M6.99365 12.5552C7.07829 12.5552 7.1735 12.5298 7.2793 12.479C7.38932 12.4282 7.493 12.3711 7.59033 12.3076C8.77523 11.5459 9.80143 10.7461 10.6689 9.9082C11.5407 9.07031 12.2157 8.20703 12.6938 7.31836C13.172 6.42969 13.4111 5.53467 13.4111 4.6333C13.4111 4.04932 13.3159 3.51611 13.1255 3.03369C12.9393 2.54704 12.6812 2.12809 12.3511 1.77686C12.021 1.42562 11.6359 1.15479 11.1958 0.964355C10.7557 0.769694 10.2817 0.672363 9.77393 0.672363C9.14339 0.672363 8.59326 0.833171 8.12354 1.15479C7.65804 1.47217 7.28141 1.89111 6.99365 2.41162C6.71436 1.89535 6.33984 1.4764 5.87012 1.15479C5.40039 0.833171 4.85026 0.672363 4.21973 0.672363C3.71191 0.672363 3.23796 0.769694 2.79785 0.964355C2.36198 1.15479 1.97689 1.42562 1.64258 1.77686C1.3125 2.12809 1.05225 2.54704 0.861816 3.03369C0.675618 3.51611 0.58252 4.04932 0.58252 4.6333C0.58252 5.53467 0.819499 6.42969 1.29346 7.31836C1.77165 8.20703 2.44661 9.07031 3.31836 9.9082C4.19434 10.7461 5.22477 11.5459 6.40967 12.3076C6.50277 12.3711 6.60433 12.4282 6.71436 12.479C6.82438 12.5298 6.91748 12.5552 6.99365 12.5552Z" fill="black"/>
					</svg>
				</div>
			</div>
			<Footer />
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