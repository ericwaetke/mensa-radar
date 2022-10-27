'use client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import 'tailwindcss/tailwind.css'

export const DayButton = ({mensa, day, isSelected}) => {


	return (
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
	)
}