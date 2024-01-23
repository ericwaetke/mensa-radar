import postgres from "postgres"
import {
	A,
	Head,
	Link,
	Meta,
	Title,
	createRouteData,
	useRouteData,
} from "solid-start"
import Footer from "~/components/footer"
import { currentMensaData, foodOfferings, mensen } from "~/server/dbSchema"
import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from "../server/dbSchema"
import { sql, eq, gt } from "drizzle-orm"
import { createServerData$ } from "solid-start/server"
import { For, createSignal, onMount } from "solid-js"
import { getOpeningTimes } from "~/lib/getOpeningTimes"

export function routeData() {
	return createServerData$(async () => {
		// @ts-ignore
		const connectionString = process.env.DATABASE_URL
		const client = postgres(connectionString)
		const db = drizzle(client, { schema })

		const mensenList = await db
			.select({
				id: foodOfferings.mensa,
				nextFood: sql<Date>`min(food_offerings.date)`,
				name: mensen.name,
				url: mensen.url,
				locLat: mensen.locLat,
				locLong: mensen.locLong,
				openingTimes: currentMensaData.openingTimes,
				enabled: currentMensaData.enabled,
			})
			.from(foodOfferings)
			.innerJoin(mensen, eq(foodOfferings.mensa, mensen.id))
			.innerJoin(
				currentMensaData,
				eq(foodOfferings.mensa, currentMensaData.mensaId)
			)
			.where(gt(foodOfferings.date, sql`current_date`))
			.groupBy(
				sql`food_offerings.mensa, mensen.name, mensen.url, current_mensa_data."openingTimes", mensen.loc_lat, mensen.loc_long, current_mensa_data.enabled`
			)

		return mensenList as EnhancedMensaList[]
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

	function updateOpeningTimes() {
		if (!mensen()) return
		for (let i = 0; i < mensen()!.length; i++) {
			setOpeningTimes(
				new Map<number, { open: boolean; text: string }>(
					openingTimes().set(
						mensen()![i].id!,
						getOpeningTimes(mensen()![i])
					)
				)
			)
		}
	}

	onMount(() => {
		updateOpeningTimes()
		//Update the Opening Times every minute
		const interval = setInterval(() => {
			updateOpeningTimes()
		}, 60 * 1000)

		return () => clearInterval(interval)
	})

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
				<h1 class="text-xl font-serif font-bold">
					<img
						src="/logo.svg"
						class="h-6 inline-block mr-1"
						alt="Mensa Radar Topf"
					/>
					Mensa-Radar
				</h1>
			</div>

			<main class="flex h-full max-w-xl w-full flex-col gap-4 lg:mx-auto">
				<div class="flex max-w-xl flex-col divide-y divide-gray/20 rounded-xl bg-white py-0.5 pl-4">
					<For each={mensen()}>
						{(mensa) => (
							<A
								class="flex flex-col gap-0 py-3 pr-4"
								href={"/potsdam/" + mensa.url}>
								<h3 class="font-serif text-xl font-normal">
									{mensa.name}
								</h3>
								<div class="flex h-full items-center font-sans-reg text-sm">
									<div
										class={`my-auto mr-2 h-2 w-2 rounded-full ${
											openingTimes().get(mensa.id!)?.open
												? "bg-main-green"
												: "bg-red-500"
										}`}></div>
									<span class="whitespace-nowrap opacity-60">
										{openingTimes().get(mensa.id!)?.text}
									</span>
								</div>
							</A>
						)}
					</For>
				</div>
				{/* <BugReportButton /> */}
			</main>
			<Footer />
		</div>
	)
}
