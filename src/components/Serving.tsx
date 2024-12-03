import { Component, For } from "solid-js"
import { Price } from "./Serving/Price"
import { cn } from "~/lib/cn"

export const Serving: Component<{
	name: string
	priceStudents: string | null
	priceEmployees: string | null
	priceGuests: string | null
	features: string[]
}> = (props) => {
	const meatStrings = ["geflügel", "schwein", "rind"]
	const fishStrings = ["fisch", "fish"]

	return (
		<div class="flex h-fit flex-col items-start justify-center rounded-lg bg-white p-4 gap-4">
			<h1 class="text-[14px] font-bold">{props.name}</h1>
			<div class="flex flex-wrap gap-[6px]">
				<Price
					pricePrimary={props.priceStudents}
					priceSecondary={props.priceGuests}
				/>
				<For each={props.features}>
					{(feature) => (
						<div
							class={cn(
								"flex items-center bg-[#D3D6D4] text-[#3e3e3e] px-2 py-1 rounded-[4px] font-noto text-[12px] gap-1 font-semibold",
								feature.toLowerCase().includes("vegan") &&
									"bg-[#33EFB3] text-[#354937]",
								(feature
									.toLowerCase()
									.includes("vegetarisch") ||
									feature
										.toLowerCase()
										.includes("vegetarian")) &&
									"bg-[#CBE288] text-[#444935]",
								meatStrings.some((item) =>
									feature
										.toLowerCase()
										.includes(item.toLowerCase())
								) && "bg-[#FFB0A6] text-[#493735]",
								fishStrings.some((item) =>
									feature
										.toLowerCase()
										.includes(item.toLowerCase())
								) && "bg-[#90D3FA] text-[#354149]"
							)}>
							{feature}
						</div>
					)}
				</For>
			</div>
		</div>
	)
}
