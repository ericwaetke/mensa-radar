export const getWeekdayByName = (name) => {
	switch (name) {
	case "montag":
		return 0
	case "dienstag":
		return 1
	case "mittwoch":
		return 2
	case "donnerstag":
		return 3
	case "freitag":
		return 4
	case "samstag":
		return 5
	default:
		return -1
	}
}