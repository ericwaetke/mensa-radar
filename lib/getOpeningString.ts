export const getOpeningString = (currentMensa) => {
	const currentDate = new Date()
	let currentWeekday = getDates(currentDate).currentWeekday;
	const days = getDates(currentDate).days;
	const currentTime = currentDate.getHours() + currentDate.getMinutes()/60;

	const openInDays = (days: number) => currentMensa.daysWithFood.includes(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()+days}`)

	const open = currentTime >= currentMensa.openingTimes[currentWeekday].from && currentTime <= currentMensa.openingTimes[currentWeekday].to;
	const willOpenLaterToday = 
		(currentTime <= currentMensa.openingTimes[currentWeekday].from) && 
		openInDays(0);

	if(open) {
		return `offen bis ${ floatTimeToString(currentMensa.openingTimes[currentWeekday].to) }`;
	} else {
		//wird heute noch öffnen
		if(willOpenLaterToday) return `öffnet ${ floatTimeToString(currentMensa.openingTimes[currentWeekday].from) }`;
		
		//wird morgen öffnen
		if(openInDays(1)) return `öffnet morgen ${ floatTimeToString(currentMensa.openingTimes[currentWeekday].from) }`

		//wird an einem anderen Tag öffnen
		// if(!willOpenLaterToday && nextOffer.nextOfferInDays > 1) openingString = `öffnet ${ days[currentWeekday + nextOffer.nextOfferInDays].mainText } ${ floatTimeToString(currentMensa.openingTimes[currentWeekday + nextOffer.nextOfferInDays].from) }`

		//keine weiteren Daten
		return `öffnet nächste Woche`;
	}
}

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
		console.log(err)
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
