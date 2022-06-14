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
import { allergyChecker } from '../../../lib/allergyChecker';


export default function Mensa(props) {
	const router = useRouter()
  	const { mensa } = router.query

	// Switcher for Nutiotional Intformation is not yet working
	const [offers, setOffers] = useState([])
	
	const collapseNutrionionInfo = (index) => {
		let tempOffers = [...offers]
		let tempOffer = tempOffers[index]
		tempOffer = !tempOffer
		tempOffers[index] = tempOffer
		
		setOffers(tempOffers)
	}

    return (
        <div className="space-y-6 break-words mx-5 mt-12">
			<style jsx>
				{`
					.daySelection{
						position: relative;
					}
					.daySelection::before{
						content: "";
						position: absolute;
						right: 0;
						width: 20%;
						height: 100%;
						background: linear-gradient(270deg, #E5E7E5, transparent);
						pointer-events: none;
					}
					.open {
						transition: .3s;
						transform: rotate(180deg)
					}
					.closed {
						transition: .3s;
						transform: rotate(0);
					}
					.ReactCollapse--collapse {
						transition: height 500ms;
						}
				`}
			</style>

			<div>
				<Link href="/">
					<a className="p-6 pl-0 absolute ">
					&larr;
					</a>
				</Link>

				<h2 className="capitalize text-2xl text-center py-6">{mensa}</h2>
			</div>

			<div className="flex justify-between">
				{
					props.openingTimes.open ? 
					<>
						<div className="font-medium bg-custom-light-gray py-1.5 px-4 rounded-full inline-flex items-center gap-2">
							<span className="bg-green-2 w-2 h-2 rounded-full"></span>
							offen bis {props.openingTimes.openUntil}
						</div>
					</> : 
					<>
						<div className="font-medium bg-custom-light-gray py-1.5 px-4 rounded-full">öffnet um {props.openingTimes.openFrom}</div>
					</>
				}

				{/* <div className='flex items-center gap-2'>
					<div className="font-medium bg-green-3 py-1.5 px-4 rounded-full text-green-w7">1.5km</div>
					<a href='#'>Route &rarr;</a>
				</div> */}
			</div>

			{/* Day Selection */}
			<div className="daySelection">
				<div className="space-x-4 flex overflow-x-scroll overflow-y-hidden">
					{
						props.days.map((day, i) => {
							let isSelected = props.selectedWeekday - (5 - props.days.length) === i
							return <DayButton mensa={mensa} day={day} isSelected={isSelected} router={router}/>
						})
					}
				</div>
			</div>

			<div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 2xl:grid-cols-3">
            {props.foodOffers.map((offer, i) => {
				return (
					<Link href={`/[mensa]/[day]/[food]`} as={`/${mensa}/${router.query.day}/${offer._id}`}>
						<a className="flex-initial rounded-xl bg-custom-white">
							<div className="my-4 p-8 flex-initial rounded-xl bg-custom-white">
								{/* <p className="font-medium text-sm text-gray-400">{offer.titel}</p> */}
								<p className="text-2xl font-bold">{offer.beschreibung}</p>
								<div className="mt-9 flex justify-between flex-col xs:flex-row items-start gap-y-2">
									<p className="font-medium text-gray-400 text-sm"><span className="bg-custom-light-gray rounded-full py-1 px-4 text-black inline-block">{offer.preise.preis_s} €</span> <span className='text-green-w7'>{offer.preise.preis_g} €</span></p>
									{offer.labels.filter !== "all" && <p className="capitalize font-medium text-sm bg-custom-light-gray rounded-full py-1 px-4 inline-block">{offer.labels.filter}</p>}
								</div>
							</div>
						</a>
					</Link>
				)
			})}
			</div>
			<Footer />
        </div>
    )
}

export async function getServerSideProps(context) {

	console.log(allergyChecker("Wei"))

	const selectedWeekday = getWeekdayByName(context.query.day);

	const currentDate = new Date()
	let currentWeekday = currentDate.getDay() // if Weekday between 1 and 5 its in the weekday
	currentWeekday = currentWeekday === 0 ? 6 : currentWeekday - 1
	const isWeekday = currentWeekday < 5;

	let days = [
		{
			mainText: "Mo",
			subText: "",
			url: "montag",
		},
		{
			mainText: "Di",
			subText: "",
			url: "dienstag",
		},
		{
			mainText: "Mi",
			subText: "",
			url: "mittwoch",
		},
		{
			mainText: "Do",
			subText: "",
			url: "donnerstag",
		},
		{
			mainText: "Fr",
			subText: "",
			url: "freitag",
		},
	]

	// Get Dates
	for (let i = 0; i < 5; i++) {
		let tempDate = new Date(currentDate)
		if(i === currentWeekday){
			days[i].subText = `${days[i].mainText} · ${tempDate.getDate()}.${tempDate.getMonth()}`
			// days[i].subText = `${days[i].mainText}, ${tempDate.getDate()}. ${new Intl.DateTimeFormat('de-DE', {month: 'short'}).format(tempDate)}`
			days[i].mainText = "Heute"
		} else {
			tempDate.setDate(currentDate.getDate() + (i - currentWeekday))
			days[i].subText = `${tempDate.getDate()}.`
		}
	}

	days = days.slice(currentWeekday)

	const today = new Date()
	const selectedDay = new Date(today)
	selectedDay.setDate(today.getDate() + (selectedWeekday - currentWeekday))
	const selectedDayFormatted = selectedDay.toLocaleDateString("de-DE", {year: 'numeric', month: '2-digit', day: '2-digit'})

	let foodOffers = []
	try {
		const client = await clientPromise;
		const db = client.db("guckstDuEssen");

		const coll = db.collection(context.query.mensa);

		// Get the amount of Food-Offers for the current day
		const dayQuery = {date: selectedDayFormatted}
		const dayCount = await coll.countDocuments(dayQuery)

		if (dayCount === 0) {
			// Add the current STUDENTENWERK Data to the Database
			console.log("No Data for this day, adding...")
			await coll.insertMany(await getAllMensaDataFromSTW(context.query.mensa));
		}
		// getAllMensaDataFromSTW(context.query.mensa)
		const cursor = coll.find(dayQuery);
		// ID Suppresion
		//const cursor = coll.find(dayQuery, {projection: {_id: 0}});
		await cursor.forEach((e) => {
			foodOffers.push(e)
		})
		// await cursor.forEach(console.log);

		

	} catch (e) {
		console.error(e)
	}

	const floatTimeToString = (floatTime) => {
		let hours = Math.floor(floatTime)
		let minutes = Math.round((floatTime - hours) * 60)
		if (minutes < 10) {
			minutes = "0" + minutes
		}
		return hours + ":" + minutes
	}

	const findObjectInArrayByKey = (array, key, value) => {
		for (var i = 0; i < array.length; i++) {
			if (array[i][key] === value) {
				return array[i];
			}
		}
		return null;
	}

	const openFrom = floatTimeToString(findObjectInArrayByKey(mensaData, 'url', context.query.mensa).opening)
	const openUntil = floatTimeToString(findObjectInArrayByKey(mensaData, 'url', context.query.mensa).closing)
	const d = new Date();
  	const currentTime = d.getHours() + d.getMinutes()/60

	const open = currentTime >= openFrom && currentTime <= openUntil

	// Change ID of every item in foodOffers
	foodOffers.forEach((foodOffer) => {
		foodOffer._id = foodOffer._id.toString()
	})

	return {
	  props: {
		foodOffers,
		selectedWeekday,
		days,
		openingTimes: {
			openFrom,
			openUntil,
			open
		}
	  }
	}
}