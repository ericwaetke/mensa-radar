/**
 * Opening times lookup and formatting.
 *
 * This module is the single seam for everything "is the canteen open?":
 * UI components never read opening_day rows directly, they go through the
 * helpers here. Unplanned closures ("Wegen Weiterbildung geschlossen" & co)
 * will later be an exception layer - they only need to be checked first
 * inside `openingDayFor`, nothing above it has to change.
 *
 * Data comes from mensa-queue via the Payload schema: shared, deduplicated
 * `opening_day` rows linked from `mensa_rels`. A weekday without an entry
 * means the canteen is closed that day.
 */
import type { openingDay } from "@/schema"
import { formatWeekday, isSameDay, todayBerlin, type CalendarDate } from "./date"

export type OpeningDayRow = typeof openingDay.$inferSelect

export type DayKey =
	| "monday"
	| "tuesday"
	| "wednesday"
	| "thursday"
	| "friday"
	| "saturday"
	| "sunday"

const DAY_KEYS: DayKey[] = [
	"sunday",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
]

/** The DayKey of a Berlin calendar date (0 = Sunday in getUTCDay). */
export function dayKeyOf(date: CalendarDate): DayKey {
	const weekday = new Date(
		Date.UTC(date.year, date.month - 1, date.day),
	).getUTCDay()
	return DAY_KEYS[weekday]
}

/**
 * The opening day row for a calendar date, or null when the canteen is
 * closed. Exceptions (unplanned closures) get checked here first later on.
 */
export function openingDayFor(
	days: OpeningDayRow[] | undefined | null,
	date: CalendarDate,
): OpeningDayRow | null {
	if (!days) return null
	const key = dayKeyOf(date)
	return days.find((day) => day.day === key) ?? null
}

/** "08:00 – 18:00" */
export function formatOpeningRange(day: OpeningDayRow): string {
	return `${day.openingFrom} – ${day.openingTo}`
}

/** "Essenausgabe 11:00 – 16:00", or null when the day has no service range. */
export function formatServiceRange(day: OpeningDayRow): string | null {
	if (!day.serviceFrom || !day.serviceTo) return null
	return `Essenausgabe ${day.serviceFrom} – ${day.serviceTo}`
}

/** Short German weekday for a date, e.g. "Do". */
export function formatShortWeekday(date: CalendarDate): string {
	return formatWeekday(date).slice(0, 2)
}

/** Minutes since midnight on the Berlin wall clock, wherever this runs. */
export function berlinMinutes(now: Date = new Date()): number {
	const time = new Intl.DateTimeFormat("de-DE", {
		timeZone: "Europe/Berlin",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
	}).format(now)
	const [hours, minutes] = time.split(":").map(Number)
	return hours * 60 + minutes
}

function minutesOf(time: string): number {
	const [hours, minutes] = time.split(":").map(Number)
	return hours * 60 + minutes
}

export type OpeningStatus = "open" | "later" | "closed"

export type OpeningInfo = {
	/** null when the canteen is closed on that date */
	day: OpeningDayRow | null
	status: OpeningStatus
}

/**
 * Whether the canteen is open on `date`: currently open, opening later
 * today, or closed (that whole day).
 */
export function openingInfo(
	days: OpeningDayRow[] | undefined | null,
	date: CalendarDate,
	now: Date = new Date(),
): OpeningInfo {
	const day = openingDayFor(days, date)
	if (!day) return { day: null, status: "closed" }

	const isToday = isSameDay(date, todayBerlin(now))
	if (!isToday) return { day, status: "later" }

	const minutes = berlinMinutes(now)
	if (minutes < minutesOf(day.openingFrom)) return { day, status: "later" }
	if (minutes >= minutesOf(day.openingTo)) return { day, status: "closed" }
	return { day, status: "open" }
}

/**
 * The label for the mensa list: "Heute 08:00 – 18:00" or "Geschlossen".
 */
export function formatListSummary(info: OpeningInfo): string {
	if (!info.day) return "Geschlossen"
	return `Heute ${formatOpeningRange(info.day)}`
}

/**
 * The label for the menu header of a viewed date, e.g. "Heute bis 18:00",
 * "Do 08:00 – 16:30" or "Geschlossen".
 */
export function formatHeaderSummary(
	info: OpeningInfo,
	viewedDate: CalendarDate,
	now: Date = new Date(),
): string {
	if (!info.day) return "Geschlossen"
	if (isSameDay(viewedDate, todayBerlin(now))) {
		return `offen bis ${info.day.openingTo}`
	}
	return `${formatShortWeekday(viewedDate)} ${formatOpeningRange(info.day)}`
}
