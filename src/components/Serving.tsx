import { Component, For, Show } from "solid-js"
import { Price } from "./Serving/Price"
import { cn } from "~/lib/cn"
import { Recipe } from "~/api/server"

export const Serving: Component<Recipe> = (props) => {
	const meatStrings = ["geflügel", "schwein", "rind"]
	const fishStrings = ["fisch", "fish"]

	return (
		<div class="flex h-fit flex-col items-start justify-center rounded-lg bg-white overflow-clip">
			<Show when={props.aiThumbnail}>
				<img
					src={props.aiThumbnail!.url}
					alt={props.aiThumbnail!.alt}
					class="w-full h-[200px] object-cover"
				/>
			</Show>
			<div class="p-4 flex flex-col gap-4">
				<h1 class="text-[14px] font-bold">{props.name}</h1>
				<div class="flex flex-wrap gap-[6px]">
					<Price
						pricePrimary={props.price.students}
						priceSecondary={props.price.employees}
						priceTertiary={props.price.guests}
					/>
					<For each={props.features}>
						{(feature) => (
							<Show when={feature.visibleSmall}>
								<div
									class={cn(
										"flex items-center bg-[#D3D6D4] text-[#3e3e3e] px-2 py-1 rounded-[4px] font-noto text-[12px] gap-1 font-semibold ring-inset ring-1 ring-black/10",
										feature.name
											.toLowerCase()
											.includes("vegan") &&
										"bg-[#33EFB3] text-[#354937]",
										(feature.name
											.toLowerCase()
											.includes("vegetarisch") ||
											feature.name
												.toLowerCase()
												.includes("vegetarian")) &&
										"bg-[#CBE288] text-[#444935]",
										meatStrings.some((item) =>
											feature.name
												.toLowerCase()
												.includes(item.toLowerCase())
										) && "bg-[#FFB0A6] text-[#493735]",
										fishStrings.some((item) =>
											feature.name
												.toLowerCase()
												.includes(item.toLowerCase())
										) && "bg-[#90D3FA] text-[#354149]"
									)}>
									{feature.name}
								</div>
							</Show>
						)}
					</For>
				</div>
			</div>
		</div>
	)
}
