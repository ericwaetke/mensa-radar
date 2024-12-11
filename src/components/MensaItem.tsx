import { mensa, mensaProvider } from "@/schema"
import Accordion from "@corvu/accordion"
import { Component } from "solid-js"
import { ChevronUp } from "./icons"

export const MensaItem: Component<{
	isFavourite: boolean
	toggleFavouriteState: () => void
	mensa: {
		mensa: typeof mensa.$inferSelect
		mensa_provider: typeof mensaProvider.$inferSelect
	}
	formattedDate: string
}> = (props) => {
	// <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
	//<path d="M11 1.51367L14.09 7.77367L21 8.78367L16 13.6537L17.18 20.5337L11 17.2837L4.82 20.5337L6 13.6537L1 8.78367L7.91 7.77367L11 1.51367Z" stroke="#D3D3D3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
	//</svg>
	return (
		<Accordion.Content class="overflow-hidden bg-white corvuexpanded:animate-expand corvu-collapsed:animate-collapse flex pr-2 ">
			<button
				class="group grow-0 px-3"
				onClick={() => {
					// Toggle Favourite State of Mensa
					props.toggleFavouriteState()
				}}>
				<svg
					class="text-[#D3D3D3] group-hover:text-[#5A554D]"
					width="22"
					height="22"
					viewBox="0 0 22 22"
					xmlns="http://www.w3.org/2000/svg"
					fill={props.isFavourite ? "#5A554D" : "none"}
					stroke={props.isFavourite ? "none" : "currentColor"}>
					<path
						d="M11 1.51367L14.09 7.77367L21 8.78367L16 13.6537L17.18 20.5337L11 17.2837L4.82 20.5337L6 13.6537L1 8.78367L7.91 7.77367L11 1.51367Z"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
			<a
				href={`${props.mensa.mensa_provider.slug}/${props.mensa.mensa.slug}/${props.formattedDate}`}
				class="w-full py-3 flex flex-row items-center justify-between">
				<div class="flex flex-col">
					<h4 class="text-lg font-bold">{props.mensa.mensa.name}</h4>
					<div class="flex gap-1 items-center">
						<div class="w-[6px] h-[6px] rounded-full bg-[#DCD631]" />
						<p class="text-[#726E00] font-noto text-[13px] font-medium">
							Öffnungszeiten noch nicht verfügbar
						</p>
					</div>
				</div>
				<ChevronUp class=" rotate-90" />
			</a>
		</Accordion.Content>
	)
}
