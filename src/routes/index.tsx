import { createAsync, type RouteDefinition } from "@solidjs/router"
import {
	Component,
	createEffect,
	createSignal,
	createUniqueId,
	For,
	onMount,
	Show,
} from "solid-js"
import { getMensas } from "~/api"
import { Header } from "~/components/Header"
import { Logo } from "~/components/Logo"
import Accordion from "@corvu/accordion"
import { ChevronUp } from "~/components/icons"
import { cn } from "~/lib/cn"
import { ErrorBoundary } from "solid-js"
import createTransitionSize from "solid-transition-size"
import { mensa, mensaProvider } from "@/schema"
import { MensaItem } from "~/components/MensaItem"

export const route = {
	preload() {
		getMensas()
	},
} satisfies RouteDefinition

export default function Home() {
	const mensas = createAsync(async () => getMensas(), {
		deferStream: true,
	})

	// Format the date in the format "DD-MM-YYYY"
	const currentDateTime = new Date()
	const formattedDate = `${currentDateTime.getDate()}-${
		currentDateTime.getMonth() + 1
	}-${currentDateTime.getFullYear()}`

	const [accordionValue, setAccordionValue] = createSignal<
		string | string[]
	>()
	createEffect(() => {
		if (!mensas() || mensas() === undefined) return
		setMensaProvider(Array.from(mensas()!.keys()))
	})

	const [mensaProvider, setMensaProvider] = createSignal<string[]>()

	const [favouriteMensas, setFavouriteMensas] = createSignal<number[]>([])

	onMount(() => {
		const storedFavouriteMensas = localStorage.getItem("favouriteMensas")
		if (storedFavouriteMensas) {
			storedFavouriteMensas.split(",").map((mensaId) => {
				try {
					const id = parseInt(mensaId)
					setFavouriteMensas((prev) => {
						if (prev?.includes(id)) return prev
						return [...prev, id]
					})
				} catch (error) {
					console.error("Couldnt Parse Mensa ID")
				}
			})
		}
		if (favouriteMensas().length > 0) {
			// Open Favourite Menu
			setAccordionValue(["favorites"])
		}
	})

	function toggleFavouriteState(mensaId: number) {
		// Check if Mensa is in favourites
		if (favouriteMensas().includes(mensaId)) {
			setFavouriteMensas((prev) => {
				const arr = prev
				const index = arr.indexOf(mensaId)
				if (index > -1) {
					// only splice array when item is found
					arr.splice(index, 1) // 2nd parameter means remove one item only
				}
				return [...arr]
			})
			console.log(favouriteMensas())
		} else {
			setFavouriteMensas((prev) => [...prev, mensaId])
		}
		localStorage.setItem("favouriteMensas", favouriteMensas().join(","))
	}

	function getMensaById(mensaId: number) {
		if (!mensas()) return

		for (const mensaProvider of mensas()!.values()) {
			for (const mensa of mensaProvider) {
				if (mensa.mensa.id === mensaId) return mensa
			}
		}
	}

	const [ref, setRef] = createSignal<HTMLElement | null>(null)
	const { transitionSize } = createTransitionSize({
		element: ref,
		dimension: "height",
	})

	const height = () => {
		if (!transitionSize()) return undefined
		return transitionSize() + "px"
	}

	return (
		<main class="h-full min-h-screen w-full bg-[#DDEDE2]">
			<Header />
			<div class="p-2">
				<div class="overflow-clip rounded-xl max-w-5xl mx-auto">
					<ErrorBoundary
						fallback={(err) => <div>Error: {err.message}</div>}>
						<Show when={mensas()?.keys()} fallback={"loading"}>
							<Accordion
								multiple={true}
								collapseBehavior="hide"
								value={accordionValue()}
								onValueChange={setAccordionValue}
								initialValue={mensas()?.keys().next().value}>
								<Accordion.Item value="favorites">
									<div
										ref={setRef}
										class="transition-[height] overflow-hidden"
										style={{
											height: height(),
										}}>
										<Accordion.Trigger class="items-center flex justify-between text-[#5A554D] font-bold tracking-[4%] uppercase font-noto w-full bg-[#C2D1C6] px-4 py-2 text-left transition-all duration-100 focus-visible:bg-corvu-200 focus-visible:outline-none">
											<h2>Favoriten</h2>
											<ChevronUp
												class={cn(
													"rotate-180 transition-transform",
													accordionValue() ===
														"favorites" &&
														"rotate-0"
												)}
											/>
										</Accordion.Trigger>
										<For each={favouriteMensas()}>
											{(mensaId) => (
												<MensaItem
													mensa={
														getMensaById(mensaId)!
													}
													isFavourite={favouriteMensas().includes(
														mensaId
													)}
													toggleFavouriteState={() =>
														toggleFavouriteState(
															mensaId
														)
													}
													formattedDate={
														formattedDate
													}
												/>
											)}
										</For>
									</div>
								</Accordion.Item>
								<For each={mensaProvider()}>
									{(provider) => (
										<Accordion.Item
											value={
												provider || createUniqueId()
											}>
											<div>
												<Accordion.Trigger class="items-center flex justify-between text-[#5A554D] font-bold tracking-[4%] uppercase font-noto w-full bg-[#C2D1C6] px-4 py-2 text-left transition-all duration-100 focus-visible:bg-corvu-200 focus-visible:outline-none">
													<h2>
														{
															mensas()?.get(
																provider
															)![0].mensa_provider
																.name
														}
													</h2>
													<ChevronUp
														class={cn(
															"rotate-180 transition-transform",
															accordionValue() ===
																provider &&
																"rotate-0"
														)}
													/>
												</Accordion.Trigger>
												<For
													each={mensas()?.get(
														provider
													)}>
													{(mensa) => (
														<MensaItem
															mensa={mensa}
															isFavourite={favouriteMensas().includes(
																mensa.mensa.id
															)}
															toggleFavouriteState={() =>
																toggleFavouriteState(
																	mensa.mensa
																		.id
																)
															}
															formattedDate={
																formattedDate
															}
														/>
													)}
												</For>
											</div>
										</Accordion.Item>
									)}
								</For>
							</Accordion>
						</Show>
					</ErrorBoundary>
				</div>
			</div>
		</main>
	)
}
