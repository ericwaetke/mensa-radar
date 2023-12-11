import * as dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import tz from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(tz)

export const getOpeningTimes: (currentMensa: EnhancedMensaList) => {
	open: boolean
	text: string
} = (currentMensa: EnhancedMensaList) => {
	const currentWeekday =
		new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
	const days = ["mo", "tu", "we", "th", "fr", "sa", "su"] as const
	const currentDay = days[currentWeekday]

	const currentDate = new Date()
	const nextFood = new Date(currentMensa.nextFood)

	if (!currentMensa.openingTimes) {
		return {
			open: false,
			text: "Keine Öffnungszeiten hinterlegt",
		}
	}
	const defaultOpeningTimes = {
		from: 0,
		to: 0
	}
	let openingTimes: MensaOpeningTime = defaultOpeningTimes;
	switch (currentDay) {
		case "mo":
			openingTimes = currentMensa.openingTimes.mo || defaultOpeningTimes;
			break;
		case "tu":
			openingTimes = currentMensa.openingTimes.tu || defaultOpeningTimes;
			break;
		case "we":
			openingTimes = currentMensa.openingTimes.we || defaultOpeningTimes;
			break;
		case "th":
			openingTimes = currentMensa.openingTimes.th || defaultOpeningTimes;
			break;
		case "fr":
			openingTimes = currentMensa.openingTimes.fr || defaultOpeningTimes;
			break;
		case "sa":
			openingTimes = currentMensa.openingTimes.sa || defaultOpeningTimes;
			break;
		case "su":
			openingTimes = currentMensa.openingTimes.su || defaultOpeningTimes;
			break;
		default:
			break;
	}


	const toHour = Math.floor(openingTimes.to ? openingTimes.to : 0)
	const toMinute =
		Math.round((openingTimes.to - toHour) * 60) === 0
			? "00"
			: Math.round((openingTimes.to - toHour) * 60)

	const fromHour = Math.floor(openingTimes.from)
	const fromMinute =
		Math.round((openingTimes.from - fromHour) * 60) === 0
			? "00"
			: Math.round((openingTimes.from - fromHour) * 60)


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
		.add(isDstObserved() ? 2 : 1, "hour")
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


	// if (
	// 	currentMensa.openingTimes[
	// 	days[currentWeekday + 1 > 6 ? 0 : currentWeekday + 1]
	// 	]
	// ) {
	// 	const openingTimes =
	// 		currentMensa.openingTimes[
	// 		days[currentWeekday + 1 > 6 ? 0 : currentWeekday + 1]
	// 		]
	// 	const fromHour = Math.floor(openingTimes.from)
	// 	const fromMinute =
	// 		Math.round((openingTimes.from - fromHour) * 60) === 0
	// 			? "00"
	// 			: Math.round((openingTimes.from - fromHour) * 60)

	// 	const tomorrow = new Date(currentDate)
	// 	tomorrow.setDate(tomorrow.getDate() + 1)


	// 	const tomorrowHasFood = nextFood.toISOString().split('T')[0] === tomorrow.toISOString().split('T')[0];
	// 	// const tomorrowHasFood = currentMensa.daysWithFood.includes(tomorrow.toISOString().split('T')[0]);
	// 	if (tomorrowHasFood) {
	// 		return {
	// 			open: false,
	// 			text: `Öffnet morgen um ${fromHour}:${fromMinute}`,
	// 		}
	// 	}
	// }

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
		const dayAfterTomorrowHasFood = nextFood.toISOString().split('T')[0] === dayAfterTomorrow.toISOString().split('T')[0];
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