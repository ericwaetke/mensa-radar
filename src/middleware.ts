import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	// const mensa = request.nextUrl.pathname.split("/")[2]
	// const currentDate = new Date()
	// const currentWeekday =
	// 	currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1
	// const weekday = [
	// 	"montag",
	// 	"dienstag",
	// 	"mittwoch",
	// 	"donnerstag",
	// 	"freitag",
	// 	"samstag",
	// 	"sonntag",
	// ]

	// if (
	// 	currentDate.getHours() <= 18 ||
	// 	currentWeekday === 5 ||
	// 	currentWeekday === 6
	// )
	// 	return NextResponse.redirect(
	// 		new URL(`/mensa/${mensa}/${weekday[currentWeekday]}`, request.url)
	// 	)

	// return NextResponse.redirect(
	// 	new URL(`/mensa/${mensa}/${weekday[currentWeekday]}`, request.url)
	// )
	// return NextResponse.redirect(new URL(`/mensa/${mensa}/${weekday[currentWeekday + 1]}`, request.url))
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: "/mensa/:mensa/",
}
