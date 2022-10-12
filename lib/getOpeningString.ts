import { mensaData } from "../pages"

export const getOpeningString = (mensa: string) => {
	const currentDate = new Date()
	let currentWeekday = getDates(currentDate).currentWeekday;
    const days = getDates(currentDate).days;

    const currentTime = currentDate.getHours() + currentDate.getMinutes()/60;
    const openingTimes =  findObjectInArrayByKey(mensaData, "url", mensa).openingTimes
    const nextOffer = nextOffering(mensa, currentWeekday)
    const open = currentTime >= openingTimes[currentWeekday].from && currentTime <= openingTimes[currentWeekday].to;
    const willOpenLaterToday = (currentTime <= openingTimes[currentWeekday].from) && nextOffer.offerToday;

    let openingString;
    if(open) openingString = `offen bis ${ floatTimeToString(openingTimes[currentWeekday].from) }`;
    if(!open && willOpenLaterToday) openingString = `öffnet ${ floatTimeToString(openingTimes[currentWeekday].from) }`;
    if(!open && !willOpenLaterToday && nextOffer.nextOfferInDays != -1) openingString = `öffnet ${ days[currentWeekday + nextOffer.nextOfferInDays].mainText } ${ floatTimeToString(openingTimes[currentWeekday + nextOffer.nextOfferInDays].from) }`
    if(!open && nextOffer.nextOfferInDays === -1) openingString = `öffnet nächste Woche`;

    return {
        openingString,
        currentDate
    }
}

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

const nextOffering = (mensa:string, currentWeekday) => {
    //connect to mongo and find out whether there is food from currentWeekday
    let days = 1;

    
  
    //erster Wert bestimmt, ob es heute was gibt
    //zweiter Wert sagt, wann es NACH heute was gibt 
    //zweiter Wert -1 bedeutet, dass es gar nichts mehr auf dem Plan gibt
    //zweiter Wert 1 bedeutet, morgen gibts essen
    //zweiter Wert sollte nicht 0 sein
    //wenn currentWeekday + nextOfferInDays über 5 geht, sollte nextOf

    if(days + currentWeekday > 5) days = -1; //wenn nach samstag noch essen gibt, dann ists einfach "nächste Woche"
    if(days < -1) days = -1;
    return {offerToday: true, nextOfferInDays: days};
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
