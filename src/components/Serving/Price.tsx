import { Show, VoidComponent } from "solid-js"

export const Price: VoidComponent<{
	pricePrimary?: number | null
	priceSecondary?: number | null
	priceTertiary?: number | null
}> = (props) => {
	function padPrice(price?: number | null) {
		if (!price) return null
		return new Intl.NumberFormat("de-DE", {
			style: "decimal",
			maximumFractionDigits: 2,
			minimumFractionDigits: 2,
		}).format(price)
	}

	return (
		<div class="flex items-center bg-[#D3D6D4] px-2 py-1 rounded-[4px] font-noto text-[12px] gap-1 font-semibold ring-inset ring-1 ring-black/10">
			<span>{padPrice(props.pricePrimary)}&thinsp;€</span>
			<Show when={props.priceSecondary}>
				<span class="opacity-50">·</span>
				<span class="opacity-50">
					{padPrice(props.priceSecondary)}&thinsp;€
				</span>
			</Show>
			<Show when={props.priceTertiary}>
				<span class="opacity-25">·</span>
				<span class="opacity-25">
					{padPrice(props.priceTertiary)}&thinsp;€
				</span>
			</Show>
		</div>
	)
}
