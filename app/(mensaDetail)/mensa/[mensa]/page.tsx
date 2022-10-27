'use client';
import {useRouter} from "next/navigation"

export default function Index({params}) {
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

    router.push(`/mensa/${params.mensa}/${weekday[currentWeekday]}`)
    
    return <></>
}