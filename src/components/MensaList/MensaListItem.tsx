export default function MensaListItem() {
	return (
		<div class="px-4 py-3 w-full flex flex-row justify-between">
			<div class="flex flex-col">
				<h3 class="font-serif text-xl font-semibold">Wildau</h3>
				<div class="flex gap-2 items-center">
					<span class="bg-sec-green-darker h-[6px] w-[6px] rounded-full">
						{" "}
					</span>
					<p class="text-sec-light-text font-sans font-semibold text-sm">
						Offen bis 14: 30
					</p>
				</div>
			</div>
			<img src="/chevron-right.svg" />
		</div>
	)
}
