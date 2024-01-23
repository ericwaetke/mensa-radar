import Disclosure from "corvu/disclosure"

export const MensaList = () => {
	return (
		<div>
			<Disclosure.Root collapseBehavior="hide">
				<Disclosure.Trigger class="w-full">
					<h2 class="font-sans font-bold text-base tracking-wide text-sec-light-text uppercase text-center">
						Berlin
					</h2>
				</Disclosure.Trigger>
				<Disclosure.Content class="overflow-clip corvu-expanded:animate-expand corvu-collapsed:animate-collapse">
					<div class="bg-white px-4 py-3 rounded-xl">
						<div class="flex flex-col">
							<h3 class="font-serif text-xl font-semibold">
								Wildau
							</h3>
							<div class="flex gap-2 items-center">
								<span class="bg-sec-green-darker h-[6px] w-[6px] rounded-full">
									{" "}
								</span>
								<p class="text-sec-light-text font-sans font-semibold text-sm">
									Offen bis 14: 30
								</p>
							</div>
						</div>
					</div>
				</Disclosure.Content>
			</Disclosure.Root>
		</div>
	)
}
