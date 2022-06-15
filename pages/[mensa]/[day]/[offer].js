import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
var parseString = require("xml2js").parseString;
import 'tailwindcss/tailwind.css'
import Footer from '../../../components/footer';
import { mensaData } from '../..';
import { DayButton } from '../../../components/dayButton';
// import "../../assets/css/mensa.module.css"

import clientPromise from '/lib/mongodb'
import foodTypeChecker from '/lib/foodTypeChecker';
import { getWeekdayByName } from '/lib/getWeekdayByName';
import { getWeekNumber } from '/lib/getWeekNumber';
import { getAllMensaDataFromSTW } from '/lib/getMensaData';
import { formatDate } from '/lib/formatDate';
import { ObjectId } from 'mongodb';
import { QualityRatingComponent } from '../../../components/ratings/qualityRatingComponent';
import { makeId } from '../../../lib/makeId';
import { getItem, setItem } from '../../../lib/localStorageHelper';
import postData, { saveQualityReviewToDB } from '../../../lib/postData';
import { NutrientOverview } from '../../../components/nutrients/nutrientOverview';

export default function Mensa(props) {
	const router = useRouter()
  	const { mensa } = router.query

	const calculateAverage = (array) => {
		let sum = 0
		array.forEach((num) => { sum += num.rating })
		return sum / array.length
	}

	const offer = props.offer
	console.log(offer.qualityRating)
	const [qualityRating, setQualityRating] = useState(
		offer.qualityRating ? calculateAverage(offer.qualityRating) : 0
	)
	const [userQualityRating, setUserQualityRating] = useState(0)
	const handleUserQualityRating = async (rating) => {
        let sessionId = getItem("sessionId")
        if (!sessionId) {
            sessionId = makeId()
            setItem("sessionId", sessionId)
        }

        setUserQualityRating(rating)
		saveQualityReviewToDB(offer, rating, router.query.mensa, sessionId)
    }

	return (
        <div className="space-y-6 break-words mx-5 mt-12">
			<div>
                <Link href={`/[mensa]/[day]/`} as={`/${mensa}/${router.query.day}/`}>
					<a className="p-6 pl-0 absolute ">
					&larr;
					</a>
				</Link>

				<h2 className="capitalize text-2xl text-center py-6">{mensa}</h2>
			</div>

			<div className="space-y-6 lg:space-y-0">
				<div className="flex-initial rounded-xl bg-custom-white divide-y divide-solid">
					<div className="p-8">
						<p className="font-medium text-sm text-gray-400">{offer.titel}</p>
						<p className="text-2xl font-medium">{offer.beschreibung}</p>
						<div className="mt-9 flex justify-between flex-col xs:flex-row items-start gap-y-2">
							<p className="font-medium text-gray-400 text-sm"><span className="bg-custom-light-gray rounded-full py-1 px-4 text-black inline-block">{offer.preise.preis_s} €</span> <span className='text-green-w7'>{offer.preise.preis_g} €</span></p>
							{offer.labels.filter !== "all" && <p className="capitalize font-medium text-sm bg-custom-light-gray rounded-full py-1 px-4 inline-block">{offer.labels.filter}</p>}
						</div>
					</div>
					<div className="py-4">
						<p className="px-8 font-bold text-xs text-custom-black opacity-40 uppercase">Nährwerte</p>
						
						<NutrientOverview nutrients={offer.nutrients} />
						<p className='px-8 text-sm opacity-40 italic font-serif'>Verglichen nach dem Tagesbedarf der Optimalen Nährwerteverteilung nach DGE</p>
					</div>
					<div className="py-4">
						<p className="px-8 font-bold text-xs text-custom-black opacity-40 uppercase">Allergene</p>
						<div className="px-8 pb-4 text-sm font-serif">
								{offer.allergene.join(", ")}
							</div>
					</div>
					<QualityRatingComponent handleUserQualityRating={handleUserQualityRating} qualityRating={qualityRating} userQualityRating={userQualityRating}/>
				</div>
			</div>
			<Footer />
        </div>
    )
}

export async function getServerSideProps(context) {
	try {
		const client = await clientPromise;
		const db = client.db("guckstDuEssen");

		const coll = db.collection(context.query.mensa);

        const offerQuery = {_id: ObjectId(context.query.offer)}
        let offer = await coll.findOne(offerQuery)

        offer._id = offer._id.toString()

        return {
            props: {
                offer
            }
        }
	} catch (e) {
		console.error(e)

        return {
            props: {
                offer: null
            }
        }
	}

}