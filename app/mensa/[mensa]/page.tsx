'use client';
import {useRouter} from "next/navigation"

export default function Index({mensa}) {
    const router = useRouter()
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

    // if (typeof window !== 'undefined') {
    // }
    router.push(`/mensa/${mensa}/${weekday[currentWeekday]}`)
    
    return <></>
}