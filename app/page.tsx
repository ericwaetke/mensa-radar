import { use } from "react";
import { createClient } from "@supabase/supabase-js";

import Link from 'next/link';

import { floatTimeToString, getDates } from "../lib/getOpeningString";

import { DistanceToMensa } from "../components/distanceToMensa";
import Footer from "../components/footer";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

const getOpeningString = (currentMensa) => {
	const currentDate = new Date()
	let currentWeekday = getDates(currentDate).currentWeekday;
	const days = getDates(currentDate).days;
	const currentTime = currentDate.getHours() + currentDate.getMinutes()/60;

	const openInDays = (days: number) => currentMensa.daysWithFood.includes(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()+days}`)

	const open = currentTime >= currentMensa.openingTimes[currentWeekday].from && currentTime <= currentMensa.openingTimes[currentWeekday].to;
	const willOpenLaterToday = 
		(currentTime <= currentMensa.openingTimes[currentWeekday].from) && 
		openInDays(0);

	if(open) {
		return `offen bis ${ floatTimeToString(currentMensa.openingTimes[currentWeekday].to) }`;
	} else {
		//wird heute noch öffnen
		if(willOpenLaterToday) return `öffnet ${ floatTimeToString(currentMensa.openingTimes[currentWeekday].from) }`;
		
		//wird morgen öffnen
		if(openInDays(1)) return `öffnet morgen ${ floatTimeToString(currentMensa.openingTimes[currentWeekday].from) }`

		//wird an einem anderen Tag öffnen
		// if(!willOpenLaterToday && nextOffer.nextOfferInDays > 1) openingString = `öffnet ${ days[currentWeekday + nextOffer.nextOfferInDays].mainText } ${ floatTimeToString(currentMensa.openingTimes[currentWeekday + nextOffer.nextOfferInDays].from) }`

		//keine weiteren Daten
		return `öffnet nächste Woche`;
	}
}

const fetchData = async () => {
	// const mensenReq = await supabase.from('mensen').select()
	const mensenReq = await fetch(`https://bqfzesnwsvziyglfeezk.supabase.co/rest/v1/mensen?select=*`, {
		headers: {
			'apikey': supabaseKey,
			'Authentication': `Bearer ${supabaseKey}`,
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		next: {
			revalidate: 60*5
		}
	})
	let mensen = await mensenReq.json()

	const currentMensaData = await supabase.from('current_mensa_data').select()
	const currentMensaDataJson = await currentMensaData.data

	
	mensen = mensen.map(mensa => {
		const currentMensa = currentMensaDataJson.find(currentMensa => currentMensa.mensa === mensa.id)
		

		return {
			...mensa,
			...currentMensa,
			openingString: getOpeningString(currentMensa)
		}
	})

	return mensen
}

export default function Page() {
	const mensen = use(fetchData())

	return (
		<div className="p-4 pb-0 space-y-6 lg:w-1/2 lg:px-0 lg:pb-4 lg:mx-auto flex flex-col h-screen justify-between">


		<main>
			<div className="m-1 mb-3">
			<h2 className="text-xl">Mensen</h2>
			</div>
			<div className="flex flex-col divide-y-2 border-y-2 divide-main-black/20 bg-green-3 rounded-xl bg-background-container py-0.5
			">
			{
				mensen.map((mensa, index) => {
				return <Link href={'/mensa/'+mensa.url} className="flex py-3 px-6 justify-between" key={index}>
							<div className="flex flex-col space-y-0.5 justify-start">
								<h3 className="text-xl font-normal font-bigtext"> {mensa.name}</h3>
								<div className="flex h-6 font-serif text-s">
									{ 
										mensa.open? <>  
										<div className="rounded-full w-2 h-2 bg-sec-green-dark mr-2 my-auto"></div>
										</> : null
									}
									{
										<span className="opacity-60"> { mensa.openingString } </span>
									}
								</div> 
							</div>
							<div className="flex pb-1">
									<DistanceToMensa mensaLat={mensa.loc_lat} mensaLong={mensa.loc_long} />
							</div>
						</Link>
				})
			}
			</div>
		</main>
			<Footer />
		</div>
	);
}