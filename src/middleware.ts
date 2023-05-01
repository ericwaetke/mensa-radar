import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const mensa = (request.nextUrl.pathname).split('/')[2]
	const currentDate = new Date()
	let currentWeekday = currentDate.getDay()
	currentWeekday = currentWeekday === 0 ? 6 : currentWeekday - 1
	const weekday = [
		"montag",
		"dienstag",
		"mittwoch",
		"donnerstag",
		"freitag",
		"samstag",
		"sonntag"
	]

	return NextResponse.redirect(new URL(`/mensa/${mensa}/${weekday[currentWeekday]}`, request.url))
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: '/mensa/:mensa/',
}