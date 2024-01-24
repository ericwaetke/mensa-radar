import MensaGroup from "./MensaGroup"

export const MensaList = () => {
	function searchMensa(searchString: string) {}

	return (
		<div class="max-w-xl w-full flex flex-col gap-5">
			{/* Search Bar */}
			<input
				type="text"
				class="w-full rounded-lg border border-sec-kontur px-4 h-12 bg-[#BBD1BD] placeholder:text-sec-light-text placeholder:font-sans placeholder:text-base"
				placeholder="Suche nach Mensa"
				onInput={(e) => searchMensa(e.currentTarget.value)}
			/>
			<MensaGroup />
			<MensaGroup items={5} />
		</div>
	)
}
