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

export default function Mensa(props) {
	const router = useRouter()
  	const { mensa } = router.query

	const offer = props.offer
	
	// const [qualityRating, setQualityRating] = useState(0)
	// const [userQualityRating, setUserQualityRating] = useState(0)
	// const handleUserQualityRating = async (rating) => {
    //     let sessionId = getItem("sessionId")
    //     if (!sessionId) {
    //         sessionId = makeId()
    //         setItem("sessionId", sessionId)
    //     }

    //     setUserQualityRating(rating)
    //     console.log(offer)

	// 	// Update in Database
	// 	try {
	// 		const client = await clientPromise
	// 		const db = client.db("mensa")
	// 		const coll = db.collection(context.query.mensa);

	// 		const filter = {
	// 			"_id": ObjectId(offer._id)
	// 		}

	// 		const update = {
	// 			$set: {
	// 				"qualityRating": [...offer.qualityRating, {
	// 					"sessionId": sessionId,
	// 					"rating": rating
	// 				}],
	// 			}
	// 		}

	// 		const result = await coll.updateOne(filter, update)
	// 		console.log(result)

	// 	} catch (error) {
	// 		console.log(error)
	// 	}
    // }

	console.log(offer.nutrients[0].value / 8368 * 100)

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
						<div className='px-6 flex flex-none break-all'>
							<div className="px-2 pb-4 w-1/3 flex flex-col gap-2">
								<p className='text-sm'>
								{`${offer.nutrients[1].value}${offer.nutrients[1].unit}`}
								</p>

								{/* Bar */}
								<div className='h-1 w-full bg-custom-light-gray relative rounded-full'>
									<div className='h-1 bg-custom-nutrient-orange absolute border-r-2 border-custom-white' style={{width: `${offer.nutrients[1].value / (72 * 1.1) * 100}%`}}></div>
									<div className='h-4 w-1 bg-custom-nutrient-stopper absolute border-r-2 border-custom-white' style={{top: "-6px", right: `${72*1.1 / 72*.1 * 100 }%`}}></div>
								</div>
								<p className='text-sm font-serif'>
								{offer.nutrients[1].name}
								</p>
							</div>
							<div className="px-2 pb-4 w-1/3 flex flex-col gap-2">
								<p className='text-sm'>
								{`${offer.nutrients[2].value}${offer.nutrients[2].unit}`}
								</p>

								{/* Bar */}
								<div className='h-1 w-full bg-custom-light-gray relative rounded-full'>
									<div className='h-1 bg-custom-nutrient-purple absolute border-r-2 border-custom-white' style={{width: `${offer.nutrients[2].value / (264 * 1.1) * 100}%`}}></div>
									<div className='h-4 w-1 bg-custom-nutrient-stopper absolute border-r-2 border-custom-white' style={{top: "-6px", right: `${264 * 1.1 / 264*.1 * 100 }%`}}></div>
								</div>
								<p className='text-sm font-serif'>
								{offer.nutrients[2].name}
								</p>
							</div>
							<div className="px-2 pb-4 w-1/3 flex flex-col gap-2">
								<p className='text-sm'>
								{`${offer.nutrients[3].value}${offer.nutrients[3].unit}`}
								</p>

								{/* Bar */}
								<div className='h-1 w-full bg-custom-light-gray relative rounded-full'>
									<div className='h-1 bg-custom-nutrient-red absolute border-r-2 border-custom-white' style={{width: `${offer.nutrients[3].value / (66 * 1.1) * 100}%`}}></div>
									<div className='h-4 w-1 bg-custom-nutrient-stopper absolute border-r-2 border-custom-white' style={{top: "-6px", right: `${66 * 1.1 / 66* .1 * 100 }%`}}></div>
								</div>
								<p className='text-sm font-serif'>
								{offer.nutrients[3].name}
								</p>
							</div>
						</div>
						<div className="px-8 pb-4 flex flex-col gap-2">
							<p className='text-sm'>
							{`${offer.nutrients[0].value}${offer.nutrients[0].unit}`}
							</p>

							{/* Bar */}
							<div className='h-1 w-full bg-custom-light-gray relative rounded-full'>
								<div className='h-1 bg-custom-nutrient-green absolute border-r-2 border-custom-white' style={{width: `${offer.nutrients[0].value / (8368*1.1) * 100}%`}}></div>
								<div className='h-4 w-1 bg-custom-nutrient-stopper absolute border-r-2 border-custom-white' style={{top: "-6px", right: `${8368*1.1 / 8368 * .1 * 100 }%`}}></div>
							</div>
							<p className='text-sm font-serif'>
							{offer.nutrients[0].name}
							</p>
						</div>
						<p className='px-8 text-sm opacity-40 italic font-serif'>Verglichen nach dem Tagesbedarf der Optimalen Nährwerteverteilung nach DGE</p>
					</div>
					<div className="py-4">
						<p className="px-8 font-bold text-xs text-custom-black opacity-40 uppercase">Allergene</p>
						<div className="px-8 pb-4 text-sm font-serif">
								{offer.allergene.join(", ")}
							</div>
					</div>
					{/* <QualityRatingComponent handleUserQualityRating={handleUserQualityRating} qualityRating={qualityRating} userQualityRating={userQualityRating}/> */}
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