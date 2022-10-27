'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { getDates } from "../../../../lib/getOpeningString"
import { getWeekdayByName } from "../../../../lib/getWeekdayByName"

export default function DaySwitcher() {
const pathname = usePathname()
// split pathname into array by "/"
const pathArray = pathname.split("/")
const mensa = pathArray[2]
const selectedWeekday = getWeekdayByName(pathArray[3])

	return (
		<div 
			className="space-x-4 flex overflow-x-scroll overflow-y-hidden"
			// variants={containerAnimation}
			// initial="hidden"
			// animate="show"
			>
			{
				getDates(new Date()).shownDays.map((day, i) => {
					let isSelected = selectedWeekday - (6 - getDates(new Date()).shownDays.length) === i					
					return <div 
					// variants={dayVariantAnimation}
					>
						<Link href={`/mensa/${mensa}/${day.url}`} className={`${isSelected ? "bg-main-green" : "bg-background-container"} h-max px-8 py-4 inline-flex min-w-max flex-col items-start justify-center rounded-xl text-green-w7 uppercase`}>
							<p className={`font-bold ${isSelected ? 'text-black' : null}`}>{day.mainText}</p>
							{
								isSelected ? 
								<>
									<p className="text-sm">
										{day.subText}
									</p>
								</> : null
							}
						</Link>
					</div>
				}) 
			} 
		</div>
	)
}