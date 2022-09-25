import clientPromise from '../../lib/mongodb'
import { getAllMensaDataFromSTW } from '../../lib/getMensaData';
import { getWeekdayByName } from '../../lib/getWeekdayByName';
import {mensaData} from "../"
import { NextApiRequest, NextApiResponse } from 'next';


export const fetchDbData = async (reqDay, mensa) => {
	const selectedWeekday = getWeekdayByName(reqDay)

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
	console.log(today.getDate(), selectedWeekday, currentWeekday)
	const selectedDayFormatted = selectedDay.toLocaleDateString("de-DE", {year: 'numeric', month: '2-digit', day: '2-digit'})

	let foodOffers = []
	try {
		const client = await clientPromise;
		const db = client.db("guckstDuEssen");

		const coll = db.collection(mensa);

		// Get the amount of Food-Offers for the current day
		const dayQuery = {date: selectedDayFormatted}
		const dayCount = await coll.countDocuments(dayQuery)

		if (dayCount === 0) {
			// Add the current STUDENTENWERK Data to the Database
			console.log("No Data for this day, adding...")
			await coll.insertMany(await getAllMensaDataFromSTW(mensa));
		}
		
		const cursor = coll.find(dayQuery);
		// ID Suppresion
		//const cursor = coll.find(dayQuery, {projection: {_id: 0}});
		await cursor.forEach((e) => {
			console.log(e)
			foodOffers.push(e)
		})
		// await cursor.forEach(console.log);

		

	} catch (e) {
		console.error(e)
	}

	const floatTimeToString = (floatTime) => {
		let hours = Math.floor(floatTime)
		let minutes: any = Math.round((floatTime - hours) * 60)
		if (minutes < 10) {
			minutes = "0" + minutes.toString()
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

	const openFrom = floatTimeToString(findObjectInArrayByKey(mensaData, 'url', mensa).opening)
	const openUntil = floatTimeToString(findObjectInArrayByKey(mensaData, 'url', mensa).closing)
	const d = new Date();
  	const currentTime = d.getHours() +":"+ d.getMinutes()/60

	const open = currentTime >= openFrom && currentTime <= openUntil

	// Change ID of every item in foodOffers
	foodOffers.forEach((foodOffer) => {
		foodOffer._id = foodOffer._id.toString()
	})
	console.log("API")
	console.log({
		foodOffers,
		selectedWeekday,
		days,
		openingTimes: {
			openFrom,
			openUntil,
			open
		}
	})

	return {
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

export default async (req: NextApiRequest, res: NextApiResponse) => {

	console.log("API Request")
	console.log(req.body)

	const {selectedWeekday, mensa}: {selectedWeekday: string, mensa: string} = JSON.parse(req.body)

	console.log(selectedWeekday, mensa)

    const data = await fetchDbData(selectedWeekday ? selectedWeekday : "mittwoch", mensa ? mensa : "fhp")

    res.status(200).json(data)
  }