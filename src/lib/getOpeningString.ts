import * as dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import tz from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(tz)

export const getOpeningTimes: (currentMensa: EnhancedMensaList) => {
	open: boolean
	text: string
} = (currentMensa: EnhancedMensaList) => {
	console.log(currentMensa)
	const currentWeekday =
		new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
	const days = ["mo", "tu", "we", "th", "fr", "sa", "su"]

	const currentDate = new Date()

	if (
		currentMensa.openingTimes &&
		currentMensa.openingTimes[days[currentWeekday]]
	) {
		const openingTimes:
			| {
					from: number
					to: number
			  }
			| undefined = currentMensa.openingTimes[days[currentWeekday]]
		const toHour = Math.floor(openingTimes?.to ? openingTimes?.to : 0)
		const toMinute =
			Math.round((openingTimes?.to - toHour) * 60) === 0
				? "00"
				: Math.round((openingTimes?.to - toHour) * 60)

		const fromHour = Math.floor(openingTimes?.from)
		const fromMinute =
			Math.round((openingTimes?.from - fromHour) * 60) === 0
				? "00"
				: Math.round((openingTimes?.from - fromHour) * 60)

		const todayHasFood = false
		// const todayHasFood = currentMensa.daysWithFood.includes(currentDate.toISOString().split('T')[0]);
		if (todayHasFood) {
			// Check if current time is between the opening hours
			const _date = new Date()
			const stdTimezoneOffset = () => {
				var jan = new Date(_date.getFullYear(), 0, 1)
				var jul = new Date(_date.getFullYear(), 6, 1)
				return Math.max(
					jan.getTimezoneOffset(),
					jul.getTimezoneOffset()
				)
			}

			const isDstObserved = () => {
				return _date.getTimezoneOffset() < stdTimezoneOffset()
			}
			const currentTimeObj = dayjs
				.utc()
				.add(isDstObserved ? 2 : 1, "hour")
			const currentTime =
				currentTimeObj.hour() + currentTimeObj.minute() / 60

			const open =
				currentTime >= openingTimes.from &&
				currentTime <= openingTimes.to
			if (open) {
				return {
					open: true,
					text: `offen bis ${toHour}:${toMinute}`,
				}
			} else if (currentTime < openingTimes.from) {
				return {
					open: false,
					text: `Öffnet um ${fromHour}:${fromMinute}`,
				}
			}
		}
	}

	if (
		currentMensa.openingTimes[
			days[currentWeekday + 1 > 6 ? 0 : currentWeekday + 1]
		]
	) {
		const openingTimes =
			currentMensa.openingTimes[
				days[currentWeekday + 1 > 6 ? 0 : currentWeekday + 1]
			]
		const fromHour = Math.floor(openingTimes?.from)
		const fromMinute =
			Math.round((openingTimes?.from - fromHour) * 60) === 0
				? "00"
				: Math.round((openingTimes?.from - fromHour) * 60)

		const tomorrow = new Date(currentDate)
		tomorrow.setDate(tomorrow.getDate() + 1)
		const tomorrowHasFood = false
		// const tomorrowHasFood = currentMensa.daysWithFood.includes(tomorrow.toISOString().split('T')[0]);
		if (tomorrowHasFood) {
			return {
				open: false,
				text: `Öffnet morgen um ${fromHour}:${fromMinute}`,
			}
		}
	}

	const indexDayAfterTomorow =
		currentWeekday + 2 > 6 ? currentWeekday + 2 - 7 : currentWeekday + 2
	const openingTimesDayAfterTomorrow =
		currentMensa.openingTimes[days[indexDayAfterTomorow]]
	if (openingTimesDayAfterTomorrow) {
		const fromHour = Math.floor(openingTimesDayAfterTomorrow?.from)
		const fromMinute =
			Math.round((openingTimesDayAfterTomorrow?.from - fromHour) * 60) ===
			0
				? "00"
				: Math.round(
						(openingTimesDayAfterTomorrow?.from - fromHour) * 60
				  )

		const dayAfterTomorrow = new Date(currentDate)
		dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
		const dayAfterTomorrowHasFood = false
		// const dayAfterTomorrowHasFood = currentMensa.daysWithFood.includes(dayAfterTomorrow.toISOString().split('T')[0]);
		if (dayAfterTomorrowHasFood) {
			return {
				open: false,
				text: `Öffnet übermorgen um ${fromHour}:${fromMinute}`,
			}
		}
	}

	return {
		open: false,
		text: "Öffnet nächste Woche",
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
			if (i === currentWeekday) {
				days[i].subText = `${
					days[i].mainText
				} · ${tempDate.getDate()}.${tempDate.getMonth()}`
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
			shownDays,
		}
	} catch (err) {
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
			return array[i]
		}
	}

	return null
}
