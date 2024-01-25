import postgres from "postgres"
import {
	A,
	Head,
	Link,
	Meta,
	Title,
	createRouteData,
	useParams,
	useRouteData,
} from "solid-start"
import Footer from "~/components/footer"
import { currentMensaData, foodOfferings, mensen } from "~/server/dbSchema"
import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from "~/server/dbSchema"
import { sql, eq, gt } from "drizzle-orm"
import { createServerData$ } from "solid-start/server"
import { For, createSignal, onMount } from "solid-js"
import { getOpeningTimes } from "~/lib/getOpeningTimes"

// ts-ignore
import Disclosure from "corvu/disclosure"
import FoodOfferCard from "~/components/FoodOffer/FoodOfferCard"

export function routeData() {
	return createServerData$(async () => {
		// @ts-ignore
		const connectionString = process.env.DATABASE_URL
		const client = postgres(connectionString)
		const db = drizzle(client, { schema })
	})
}

export default function Home() {
	const mensen = useRouteData<typeof routeData>()

	const d = new Date()
	const currentTime = d.getHours() + d.getMinutes() / 60
	const currentDay = d.getDay()

	const [openingTimes, setOpeningTimes] = createSignal<
		Map<number, { open: boolean; text: string }>
	>(new Map())

	// function updateOpeningTimes() {
	// 	if (!mensen()) return
	// 	for (let i = 0; i < mensen()!.length; i++) {
	// 		setOpeningTimes(
	// 			new Map<number, { open: boolean; text: string }>(
	// 				openingTimes().set(
	// 					mensen()![i].id!,
	// 					getOpeningTimes(mensen()![i])
	// 				)
	// 			)
	// 		)
	// 	}
	// }

	// onMount(() => {
	// 	updateOpeningTimes()
	// 	//Update the Opening Times every minute
	// 	const interval = setInterval(() => {
	// 		updateOpeningTimes()
	// 	}, 60 * 1000)

	// 	return () => clearInterval(interval)
	// })

	const currentDate = new Date()
	const currentWeekday =
		currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1
	const weekday = [
		"montag",
		"dienstag",
		"mittwoch",
		"donnerstag",
		"freitag",
		"samstag",
		"sonntag",
	]

	const params = useParams()

	return (
		<div class="m-auto box-border flex min-h-screen flex-col items-center space-y-6 p-2 py-4 lg:mx-auto lg:px-0">
			<Head>
				<Link rel="icon" href="/favicon.ico" />

				{/* <!-- HTML Meta Tags --> */}
				<Title>Mensa-Radar — Mensen Potsdam</Title>
				<Meta
					name="description"
					content="Alle Essen der Potsdamer Mensen. Mit Bildern und ✨AI✨"
				/>

				{/* <!-- Facebook Meta Tags --> */}
				<Meta property="og:url" content="https://mensa-radar.de" />
				<Meta property="og:type" content="website" />
				<Meta
					property="og:title"
					content="Mensa-Radar — Mensen Potsdam"
				/>
				<Meta
					property="og:description"
					content="Alle Essen der Potsdamer Mensen. Mit Bildern und ✨AI✨"
				/>
				<Meta property="og:image" content="/share_root.png" />

				{/* <!-- Twitter Meta Tags --> */}
				<Meta name="twitter:card" content="summary_large_image" />
				<Meta property="twitter:domain" content="mensa-radar.de" />
				<Meta property="twitter:url" content="https://mensa-radar.de" />
				<Meta
					name="twitter:title"
					content="Mensa-Radar — Mensen Potsdam"
				/>
				<Meta
					name="twitter:description"
					content="Alle Essen der Potsdamer Mensen. Mit Bildern und ✨AI✨"
				/>
				<Meta name="twitter:image" content="/share_root.png" />
			</Head>
			<div class="flex w-full justify-center">
				<h1 class="text-h1 font-serif-bold">Mensa-Radar</h1>
			</div>

			<main class="flex h-full max-w-xl w-full flex-col gap-4 lg:mx-auto">
				<FoodOfferCard />

				{/* Mensa Information hidden behind disclosure */}
				<Disclosure.Root
					collapseBehavior="hide"
					initialExpanded={false}>
					<Disclosure.Trigger class="w-full">
						<h2 class="font-sans font-bold text-base tracking-wide text-sec-light-text uppercase text-center">
							Über die Mensa
						</h2>
					</Disclosure.Trigger>
					<Disclosure.Content class="overflow-clip corvu-expanded:animate-expand corvu-collapsed:animate-collapse bg-white rounded-lg p-4">
						<h1>Über Mensa Kiepenheuerallee (FHP)</h1>
						<p>
							Auf dem Campus der Fachhochschule Potsdam gelegen,
							ist die Mensa Kiepenheuerallee als kulinarischer
							Knotenpunkt für Studierende und Besucher
							gleichermaßen.
						</p>
						<p>
							Die im Frühjahr 2009 eröffnete Mensa
							Kiepenheuerallee ist ein fester Bestandteil des
							wachsenden Campus der Fachhochschule Potsdam. In
							zwei großzügigen Mensen und einer Cafeteria bietet
							die Mensa während des Semesters täglich ein Menü mit
							regionalen und internationalen Gerichten an. Durch
							die Verwendung saisonaler und regionaler Produkte
							trägt die Mensa zu einem nachhaltigen Speiseplan
							bei. Vegane Optionen sind an jedem Wochentag
							verfügbar, wobei der "Veggie-Mittwoch" eine
							exklusive vegane und vegetarische Auswahl bietet.
							Entdecken Sie die Mensa Kiepenheuerallee für eine
							Vielzahl von Mahlzeiten und einen bequemen
							Essensstandort auf dem Campus der Fachhochschule
							Potsdam.
						</p>
					</Disclosure.Content>
				</Disclosure.Root>
			</main>
			<Footer />
		</div>
	)
}
