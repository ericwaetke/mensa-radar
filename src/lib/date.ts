/**
 * Calendar-date helpers for "today" and day arithmetic.
 *
 * Everything is anchored to the Berlin wall clock (the canteens are in
 * Germany) and works on plain calendar dates instead of local `Date` objects,
 * so the result is identical on a UTC server, on a client in another timezone
 * and across DST changes.
 */

export type CalendarDate = {
	year: number
	month: number
	day: number
}

const TIME_ZONE = 'Europe/Berlin'

// en-CA formats as "YYYY-MM-DD"
const berlinDate = new Intl.DateTimeFormat('en-CA', {
	timeZone: TIME_ZONE,
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
})

// Explicit UTC so the weekday never depends on the host timezone
const utcWeekday = new Intl.DateTimeFormat('de-DE', {
	timeZone: 'UTC',
	weekday: 'long',
})

function toCalendarDate(
	year: number,
	month: number,
	day: number,
): CalendarDate | null {
	// Rejects what `new Date()` would silently normalize, e.g. 2026-02-30
	const roundTrip = new Date(Date.UTC(year, month - 1, day))
	if (
		roundTrip.getUTCFullYear() !== year ||
		roundTrip.getUTCMonth() !== month - 1 ||
		roundTrip.getUTCDate() !== day
	) {
		return null
	}
	return { year, month, day }
}

/** Parse the `D-M-YYYY` format used in the date URLs. */
export function parseRouteDate(date: string): CalendarDate | null {
	if (!/^\d{1,2}-\d{1,2}-\d{4}$/.test(date)) return null
	const [day, month, year] = date.split('-').map(Number)
	return toCalendarDate(year, month, day)
}

/** Format as `D-M-YYYY`, the format used in the date URLs. */
export function formatRouteDate({ year, month, day }: CalendarDate): string {
	return `${day}-${month}-${year}`
}

/** Format as `YYYY-MM-DD`, the format the hub API expects. */
export function formatApiDate({ year, month, day }: CalendarDate): string {
	const pad = (value: number) => String(value).padStart(2, '0')
	return `${year}-${pad(month)}-${pad(day)}`
}

/** Today's calendar date in Berlin, wherever this code runs. */
export function todayBerlin(now: Date = new Date()): CalendarDate {
	const [year, month, day] = berlinDate.format(now).split('-').map(Number)
	return { year, month, day }
}

/** Day arithmetic on calendar dates - DST can only move clock time, not dates. */
export function addDays(date: CalendarDate, days: number): CalendarDate {
	const shifted = new Date(
		Date.UTC(date.year, date.month - 1, date.day + days),
	)
	return {
		year: shifted.getUTCFullYear(),
		month: shifted.getUTCMonth() + 1,
		day: shifted.getUTCDate(),
	}
}

export function isSameDay(a: CalendarDate, b: CalendarDate): boolean {
	return a.year === b.year && a.month === b.month && a.day === b.day
}

/** Monday-based start of the week. */
export function startOfWeek(date: CalendarDate): CalendarDate {
	// 0 = Sunday ... 6 = Saturday
	const weekday = new Date(
		Date.UTC(date.year, date.month - 1, date.day),
	).getUTCDay()
	return addDays(date, weekday === 0 ? -6 : 1 - weekday)
}

export function isSameWeek(a: CalendarDate, b: CalendarDate): boolean {
	return (
		formatApiDate(startOfWeek(a)) === formatApiDate(startOfWeek(b))
	)
}

/** Format as `4.11.2026`, de-DE style. */
export function formatDisplayDate({ year, month, day }: CalendarDate): string {
	return `${day}.${month}.${year}`
}

/** The German weekday name of a calendar date, e.g. `Sonntag`. */
export function formatWeekday(date: CalendarDate): string {
	return utcWeekday.format(
		new Date(Date.UTC(date.year, date.month - 1, date.day, 12)),
	)
}
