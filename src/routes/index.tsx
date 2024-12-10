import { createAsync, type RouteDefinition } from "@solidjs/router"
import {
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
		return mensas()
			?.values()
			.flatMap((provider) => provider)
			.find((mensa) => mensa.mensa.id === mensaId)
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
												<Accordion.Content class="overflow-hidden bg-white corvuexpanded:animate-expand corvu-collapsed:animate-collapse flex">
													<button
														onClick={() => {
															// Toggle Favourite State of Mensa
															toggleFavouriteState(
																mensaId
															)
														}}>
														<svg
															class="w-8 h-8 ms-3 text-gray-300 dark:text-gray-500"
															aria-hidden="true"
															xmlns="http://www.w3.org/2000/svg"
															fill={
																favouriteMensas().includes(
																	mensaId
																)
																	? "currentColor"
																	: "none"
															}
															stroke={
																favouriteMensas().includes(
																	mensaId
																)
																	? "none"
																	: "currentColor"
															}
															viewBox="0 0 22 20">
															<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
														</svg>
													</button>
													<a
														href={`${getMensaById(mensaId)?.mensa_provider.slug}/${getMensaById(mensaId)?.mensa.slug}/${formattedDate}`}
														class="w-full py-3 px-4 flex flex-row items-center justify-between">
														<div class="flex flex-col">
															<h4 class="text-lg font-bold">
																{
																	getMensaById(
																		mensaId
																	)?.mensa
																		.name
																}
															</h4>
															<div class="flex gap-1 items-center">
																<div class="w-[6px] h-[6px] rounded-full bg-[#DCD631]" />
																<p class="text-[#726E00] font-noto text-[13px] font-medium">
																	Öffnungszeiten
																	noch nicht
																	verfügbar
																</p>
															</div>
														</div>
														<ChevronUp class=" rotate-90" />
													</a>
												</Accordion.Content>
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
																provider.slug &&
																"rotate-0"
														)}
													/>
												</Accordion.Trigger>
												<For
													each={mensas()?.get(
														provider
													)}>
													{(mensa) => (
														<Accordion.Content class="overflow-hidden bg-white corvuexpanded:animate-expand corvu-collapsed:animate-collapse flex">
															<button
																onClick={() => {
																	// Toggle Favourite State of Mensa
																	toggleFavouriteState(
																		mensa
																			.mensa
																			.id
																	)
																}}>
																<svg
																	class="w-8 h-8 ms-3 text-gray-300 dark:text-gray-500"
																	aria-hidden="true"
																	xmlns="http://www.w3.org/2000/svg"
																	fill={
																		favouriteMensas().includes(
																			mensa
																				.mensa
																				.id
																		)
																			? "currentColor"
																			: "none"
																	}
																	stroke={
																		favouriteMensas().includes(
																			mensa
																				.mensa
																				.id
																		)
																			? "none"
																			: "currentColor"
																	}
																	viewBox="0 0 22 20">
																	<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
																</svg>
															</button>
															<a
																href={`${mensa.mensa_provider.slug}/${mensa.mensa.slug}/${formattedDate}`}
																class="w-full py-3 px-4 flex flex-row items-center justify-between">
																<div class="flex flex-col">
																	<h4 class="text-lg font-bold">
																		{
																			mensa
																				.mensa
																				.name
																		}
																	</h4>
																	<div class="flex gap-1 items-center">
																		<div class="w-[6px] h-[6px] rounded-full bg-[#DCD631]" />
																		<p class="text-[#726E00] font-noto text-[13px] font-medium">
																			Öffnungszeiten
																			noch
																			nicht
																			verfügbar
																		</p>
																	</div>
																</div>
																<ChevronUp class=" rotate-90" />
															</a>
														</Accordion.Content>
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
