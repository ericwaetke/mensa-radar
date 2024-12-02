import { createAsync, type RouteDefinition } from '@solidjs/router'
import { createEffect, createSignal, createUniqueId, For } from 'solid-js'
import { getMensas } from '~/api'
import { Header } from '~/components/Header'
import { Logo } from '~/components/Logo'
import Accordion from '@corvu/accordion'
import { ChevronUp } from '~/components/icons'
import { cn } from '~/lib/cn'
import { ErrorBoundary } from 'solid-js'

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

	const [accordionValue, setAccordionValue] = createSignal<string>()
	createEffect(() => {
		console.log(mensas())
	})

	return (
		<main class='h-full min-h-screen w-full bg-[#DDEDE2]'>
			<Header />
			<div class='p-2'>
				<div class='overflow-clip rounded-xl max-w-5xl mx-auto'>
					<Accordion
						collapseBehavior='hide'
						value={accordionValue()}
						onValueChange={setAccordionValue}
						initialValue={mensas()?.keys().next().value}
					>
						<ErrorBoundary
							fallback={(err) => <div>Error: {err.message}</div>}
						>
							<For
								each={mensas()?.keys() &&
										mensas()?.keys().length > 0
									? mensas()?.keys()?.toArray()
									: []}
								fallback={<div>Loading...</div>}
							>
								{(provider) => (
									<Accordion.Item
										value={provider ||
											createUniqueId()}
									>
										<div>
											<Accordion.Trigger class='items-center flex justify-between text-[#5A554D] font-bold tracking-[4%] uppercase font-noto w-full bg-[#C2D1C6] px-4 py-2 text-left transition-all duration-100 focus-visible:bg-corvu-200 focus-visible:outline-none'>
												<h2>
													{mensas()?.get(provider)![0]
														.mensa_provider.name}
												</h2>
												<ChevronUp
													class={cn(
														'rotate-180 transition-transform',
														accordionValue() ===
																provider.slug &&
															'rotate-0',
													)}
												/>
											</Accordion.Trigger>
											<For each={mensas()?.get(provider)}>
												{(mensa) => (
													<Accordion.Content class='overflow-hidden bg-white corvu-expanded:animate-expand corvu-collapsed:animate-collapse'>
														<a
															href={`${mensa.mensa_provider.slug}/${mensa.mensa.slug}/${formattedDate}`}
															class='w-full py-3 px-4 flex flex-row items-center justify-between'
														>
															<div class='flex flex-col'>
																<h4 class='text-lg font-bold'>
																	{mensa.mensa
																		.name}
																</h4>
																<div class='flex gap-1 items-center'>
																	<div class='w-[6px] h-[6px] rounded-full bg-[#DCD631]' />
																	<p class='text-[#726E00] font-noto text-[13px] font-medium'>
																		Öffnungszeiten
																		noch
																		nicht
																		verfügbar
																	</p>
																</div>
															</div>
															<ChevronUp class=' rotate-90' />
														</a>
													</Accordion.Content>
												)}
											</For>
										</div>
									</Accordion.Item>
								)}
							</For>
						</ErrorBoundary>
					</Accordion>
				</div>
			</div>
		</main>
	)
}
