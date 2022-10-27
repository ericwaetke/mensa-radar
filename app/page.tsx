import { use } from "react";
import { createClient } from "@supabase/supabase-js";

import Link from 'next/link';

import { floatTimeToString, getDates, getOpeningString } from "../lib/getOpeningString";

import { DistanceToMensa } from "../components/distanceToMensa";
import Footer from "../components/footer";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

const fetchData = async () => {
	// const mensenReq = await supabase.from('mensen').select()
	const mensenReq = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/mensen?select=*`, {
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
	let mensen = await mensenReq.json()

	const currentMensaDataReq = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/current_mensa_data?select=*`, {
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
	
	mensen = mensen.map(mensa => {
		const currentMensa = currentMensaData.find(currentMensa => currentMensa.mensa === mensa.id)
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