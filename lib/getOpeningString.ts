import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export const getOpeningTimes: (currentMensa, daysWithFood) => {open: boolean, text: string} = (currentMensa, daysWithFood) => {
	const currentWeekday = new Date().getDay() - 1

	const toHour = Math.floor(currentMensa.openingTimes[currentWeekday].to)
	const toMinute = Math.round((currentMensa.openingTimes[currentWeekday].to - toHour) * 60)

	const fromHour = Math.floor(currentMensa.openingTimes[currentWeekday].from)
	const fromMinute = Math.round((currentMensa.openingTimes[currentWeekday].from - fromHour) * 60)
	const currentDate = new Date()

	// Check if today has food
	const todayHasFood = daysWithFood.includes(currentDate.toISOString().split('T')[0]);
	if (todayHasFood) {
		// Check if current time is between the opening hours
		const currentTimeObj = dayjs.utc().add(1, 'hour')
		const currentTime = currentTimeObj.hour() + currentTimeObj.minute()/60;

		const open = currentTime >= currentMensa.openingTimes[currentWeekday].from && currentTime <= currentMensa.openingTimes[currentWeekday].to;
		if (open) {
			return {
				open: true,
				text: `offen bis ${toHour}:${toMinute}`
			};
		} else if(currentTime < currentMensa.openingTimes[currentWeekday].from) {
			return {
				open: false,
				text: `Öffnet um ${fromHour}:${fromMinute}`
			};
		}
	}

	const tomorrow = new Date(currentDate)
	tomorrow.setDate(tomorrow.getDate() + 1)
	const tomorrowHasFood = daysWithFood.includes(tomorrow.toISOString().split('T')[0]);
	if (tomorrowHasFood) {
		return {
			open: false,
			text: `Öffnet morgen um ${fromHour}:${fromMinute}`
		};
	}

	const dayAfterTomorrow = new Date(currentDate)
	dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
	const dayAfterTomorrowHasFood = daysWithFood.includes(tomorrow.toISOString().split('T')[0]);
	if (dayAfterTomorrowHasFood) {
		return {
			open: false,
			text: `Öffnet übermorgen um ${fromHour}:${fromMinute}`
		};
	}

	return {
		open: false,
		text: "Öffnet nächste Woche"
	}
	
};

export const getDates = (currentDate) => {
	try {
		let currentWeekday = currentDate.getDay() // if Weekday between 1 and 5 its in the weekday
		currentWeekday = currentWeekday === 0 ? 6 : currentWeekday - 1

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
			{
				mainText: "Sa",
				subText: "",
				url: "samstag",
			},
		]

		// Get Dates
		for (let i = 0; i < 5; i++) {
			let tempDate = new Date(currentDate)
			if(i === currentWeekday){
				days[i].subText = `${days[i].mainText} · ${tempDate.getDate()}.${tempDate.getMonth()}`
				days[i].mainText = "Heute"
			} else {
				tempDate.setDate(currentDate.getDate() + (i - currentWeekday))
				days[i].subText = `${tempDate.getDate()}.`
			}
		}

		const shownDays = days.slice(currentWeekday)

		return {
			currentWeekday,
			days,
			shownDays
		} 
	}
	catch (err) {
		console.error(err)
	}
}

export const floatTimeToString = (floatTime) => {
	let hours = Math.floor(floatTime)
	let minutes: any = Math.round((floatTime - hours) * 60)
	if (minutes < 10) {
		minutes = "0" + minutes.toString()
	}
	return hours + ":" + minutes
}

export const findObjectInArrayByKey = (array, key, value) => {

	for (var i = 0; i < array.length; i++) {
		if (array[i][key] === value) {
			return array[i];
		}
	}

	return null;
}
