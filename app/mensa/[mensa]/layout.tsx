import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { use } from "react";
import { Offer } from "../../../components/offer";
import { PillOnWhiteBG } from "../../../components/pill";
import { getOpeningString, getDates } from "../../../lib/getOpeningString";
import { getWeekdayByName } from "../../../lib/getWeekdayByName";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)



const fetchData = async (url: string) => {
	const mensaDataReq = await supabase.from('mensen').select()
	const mensaData = mensaDataReq.data.filter(mensaFilter => mensaFilter.url === url)[0]

	const currentMensaDataReq = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/current_mensa_data?id=eq.${mensaData.id}&select=*`, {
		headers: {
			'apikey': supabaseKey,
			'Authorization': `Bearer ${supabaseKey}`,
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		next: {
			revalidate: 60*5
		}
	})
	const currentMensaData = await currentMensaDataReq.json()

	return {
		...mensaData,
		...currentMensaData[0],
	}
}

export default function DayLayout({ children, params}) {
	const {mensa, day} = params
	const selectedWeekday = getWeekdayByName(day)
	
	const mensaData = use(fetchData(mensa))

	const url = mensaData.url;
	const mensaName = mensaData.name;
	console.log(mensaData)
	// Switcher for Nutiotional Intformation is not yet working

	const containerAnimation = {
		hidden: {
			opacity: 0,
		},
		show: {
			opacity: 1,
			transition: {
				staggerChildren: .2,
				delayChildren: .1
			}
		}
	}
	const dayVariantAnimation = {
		hidden: {
			opacity: 0,
			y: 20
		},
		show: {
			opacity: 1,
			y: 0,
		}
	}

	const anim01 = {
		hidden: {
			opacity: 0,
		},
		show: {
			opacity: 1,
			transition: {
				staggerChildren: .1,
				delayChildren: 1
			}
		}
	}
	
	return <>
	<div className="space-y-6 break-words mx-5 mt-12 lg:w-1/2 lg:mx-auto">
			<head>
				<title>{ mensaName } - Mensa Radar</title>
			</head>
			<style jsx>
				{`
					.daySelection{
						position: relative;
					}
					.daySelection::before{
						content: "";
						position: absolute;
						right: 0;
						width: 20%;
						height: 100%;
						background: linear-gradient(270deg, #fff, transparent);
						pointer-events: none;
					}
					.open {
						transition: .3s;
						transform: rotate(180deg)
					}
					.closed {
						transition: .3s;
						transform: rotate(0);
					}
					.ReactCollapse--collapse {
						transition: height 500ms;
						}
				`}
			</style>

			<div>
				<Link href="/" className="p-2 pl-0 flex items-center gap-4">
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M11.1426 6.75C11.5568 6.75 11.8926 6.41421 11.8926 6C11.8926 5.58579 11.5568 5.25 11.1426 5.25V6.75ZM0.326533 5.46967C0.0336397 5.76256 0.0336397 6.23744 0.326533 6.53033L5.0995 11.3033C5.3924 11.5962 5.86727 11.5962 6.16016 11.3033C6.45306 11.0104 6.45306 10.5355 6.16016 10.2426L1.91752 6L6.16016 1.75736C6.45306 1.46447 6.45306 0.989592 6.16016 0.696699C5.86727 0.403806 5.3924 0.403806 5.0995 0.696699L0.326533 5.46967ZM11.1426 5.25L0.856863 5.25V6.75L11.1426 6.75V5.25Z" fill="black"/>
						</svg>
						<h2 className="text-lg font-bold text-center w-full">{mensaName}</h2>
				</Link>

			</div>

			<div className="flex justify-between">
				<PillOnWhiteBG>{ url === undefined ? "" : getOpeningString(mensaData) }</PillOnWhiteBG>
			</div>

			{
					// @ts-ignore
					day === "samstag" || day === "sonntag" ? (
						<div>
							<p>
							Heute hat die Mensa leider geschlossen. Möchtest du dir das Essen vom vergangenen Freitag anschauen?
							</p>
							<Link href={`/mensa/${mensa}/freitag`} className="p-2 px-4 rounded-xl inline-flex items-center gap-4 border">
									Zu vergangenem Freitag
							</Link>
						</div>
					) : null
			}


			{/* Day Selection */}
			<div className="daySelection">
				<div 
					className="space-x-4 flex overflow-x-scroll overflow-y-hidden"
					// variants={containerAnimation}
					// initial="hidden"
					// animate="show"
					>
					{
						
						getDates(new Date()).shownDays.map((day, i) => {
							let isSelected = selectedWeekday - (6 - getDates(new Date()).shownDays.length) === i
							console.log({isSelected, selectedWeekday, i, getDates: getDates(new Date()).shownDays.length})
							
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
			</div>
			{children}
        </div>
	</>
}