import useSWR from "swr"

const fetcher = ({url, args}) => fetch(url, {method: "post", body: JSON.stringify(args)}).then((res) => res.json()).catch((err) => console.log(err))

import { mensaData } from "../pages"

export const getDates = (currentDate) => {
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


export const useOpeningString = (mensa: string | string[]) => {

    if(mensa) {
        const { data, error } = useSWR({url: "/api/getDaysUntilNextOffer", args: {mensa}}, fetcher)

        console.log(mensa)
        const currentDate = new Date()
        let currentWeekday = getDates(currentDate).currentWeekday;
        const days = getDates(currentDate).days;

        const currentTime = currentDate.getHours() + currentDate.getMinutes()/60;
        const openingTimes =  findObjectInArrayByKey(mensaData, "url", mensa).openingTimes
        let nextOffer = data
        if(nextOffer.nextOfferInDays + currentWeekday > 5) nextOffer.nextOfferInDays = -1;


        const open = currentTime >= openingTimes[currentWeekday].from && currentTime <= openingTimes[currentWeekday].to;
        const willOpenLaterToday = (currentTime <= openingTimes[currentWeekday].from) && nextOffer.offerToday;

        let openingString;
        if(open) {
            openingString = `offen bis ${ floatTimeToString(openingTimes[currentWeekday].to) }`;
        } else {
            if(willOpenLaterToday) openingString = `öffnet ${ floatTimeToString(openingTimes[currentWeekday].from) }`;
            if(!willOpenLaterToday && nextOffer.nextOfferInDays !== -1) openingString = `öffnet ${ days[currentWeekday + nextOffer.nextOfferInDays].mainText } ${ floatTimeToString(openingTimes[currentWeekday + nextOffer.nextOfferInDays].from) }`
            if(nextOffer.nextOfferInDays < 1) openingString = `öffnet nächste Woche`;
        }
        return {
            openingString, 
            currentDate,
            isLoading: !error && !data,
            isError: error
        }
    } else {
        return {
            openingString: "",
            currentDate: "",
            isLoading: true,
            isError: false
        }
    }
    
}