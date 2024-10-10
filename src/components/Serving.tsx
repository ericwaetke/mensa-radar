import { Component, For } from 'solid-js'

export const Serving: Component<{
	name: string
	priceStudents: string | null
	priceEmployees: string | null
	priceGuests: string | null
	features: string[]
}> = (props) => {
	return (
		<div class='flex h-fit flex-col items-start justify-center rounded-lg bg-white p-4'>
			<h1 class='text-base font-bold'>{props.name}</h1>
			<div>
				<span>{props.priceStudents}</span>
			</div>
			<ul>
				<For each={props.features}>
					{(feature) => <li>{feature}</li>}
				</For>
			</ul>
		</div>
	)
}
