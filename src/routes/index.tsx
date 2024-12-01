import { createAsync, type RouteDefinition } from '@solidjs/router'
import { createEffect, For } from 'solid-js'
import { getMensas } from '~/api'
import { Logo } from '~/components/Logo'

export const route = {
	preload() {
		getMensas()
	},
} satisfies RouteDefinition

export default function Home() {
	const mensas = createAsync(async () => getMensas(), {
		deferStream: true,
	})

	createEffect(() => {
		console.log(mensas(), mensas()?.keys().toArray())
	})

	// Format the date in the format "DD-MM-YYYY"
	const currentDateTime = new Date()
	const formattedDate = `${currentDateTime.getDate()}-${
		currentDateTime.getMonth() + 1
	}-${currentDateTime.getFullYear()}`

	return (
		<main class='h-full min-h-screen w-full bg-[#DDEDE2] p-4'>
			<Logo />
			<div class='overflow-clip rounded-xl'>
				<For
					each={mensas()?.keys().toArray()}
					fallback={<div>Loading...</div>}
				>
					{(provider) => (
						<div>
							{provider.name}
							<For each={mensas()?.get(provider)}>
								{(mensa) => (
									<a
										class='flex bg-white p-4'
										href={`${mensa.mensa_provider.slug}/${mensa.mensa.slug}/${formattedDate}`}
									>
										<h4 class='text-lg font-bold'>
											{mensa.mensa
												.name}
										</h4>
										<p>
											{mensa.mensa
												.address_city}
										</p>
									</a>
								)}
							</For>
						</div>
					)}
					{}
				</For>
			</div>
		</main>
	)
}
