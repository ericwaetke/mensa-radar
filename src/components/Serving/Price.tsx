import { VoidComponent } from "solid-js"

export const Price: VoidComponent<{
	pricePrimary?: string | null
	priceSecondary?: string | null
}> = (props) => {
	function padPrice(price?: string | null) {
		if (!price) return null
		const priceFloat = parseFloat(price)
		return new Intl.NumberFormat("de-DE", {
			style: "decimal",
			maximumFractionDigits: 2,
			minimumFractionDigits: 2,
		}).format(priceFloat)
	}

	return (
		<div class="flex items-center bg-[#D3D6D4] px-2 py-1 rounded-[4px] font-noto text-[12px] gap-1 font-semibold ring-inset ring-1 ring-black/10">
			<span>{padPrice(props.pricePrimary)}&thinsp;€</span>
			<span class="opacity-50">·</span>
			<span class="opacity-50">
				{padPrice(props.priceSecondary)}&thinsp;€
			</span>
		</div>
	)
}
