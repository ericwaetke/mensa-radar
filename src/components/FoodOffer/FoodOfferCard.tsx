import Drawer from "corvu/drawer"

export default function FoodOfferCard() {
	return (
		<div class="rounded-2xl overflow-clip">
			<div class="bg-[#B3C0B5]">
				<div class="h-10 w-10"></div>
			</div>
			<div class="bg-white">
				<h2 class="p-4 font-serif font-semibold text-lg leading-6 text-pretty">
					Kartoffel-Kürbiskernrösti mit Kräuterchampignons und
					Wildkräutersalat
				</h2>
				<div class="h-12 flex divide-x border-t border-sec-kontur divide-sec-kontur">
					<button class="h-full w-full">Allergene</button>
					<Drawer.Root>
						{(props: any) => (
							<>
								<Drawer.Trigger class="h-full w-full transition-all duration-100 active:translate-y-0.5">
									Bewerten
								</Drawer.Trigger>
								<Drawer.Portal>
									<Drawer.Overlay
										class="fixed inset-0 z-40 corvu-peer-transitioning:transition-colors corvu-peer-transitioning:duration-500 corvu-peer-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)]"
										style={{
											"background-color": `rgb(0 0 0 / ${
												0.5 * props.openPercentage
											})`,
										}}
									/>
									<Drawer.Content class="peer fixed inset-x-0 bottom-0 z-50 flex h-full max-h-[500px] flex-col rounded-t-lg bg-white pt-3 corvu-transitioning:transition-transform corvu-transitioning:duration-500 corvu-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)] lg:select-none">
										<Drawer.Close />
										<Drawer.Label>Label</Drawer.Label>
										<Drawer.Description>
											Desc
										</Drawer.Description>
									</Drawer.Content>
								</Drawer.Portal>
							</>
						)}
					</Drawer.Root>

					<button class="h-full w-full">Teilen</button>
				</div>
			</div>
		</div>
	)
}
