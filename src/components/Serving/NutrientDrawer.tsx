import Drawer from "@corvu/drawer"
import { Component, For, Show, VoidComponent } from "solid-js"
import { cn } from "~/lib/cn"
import type { LabeledEntity, Nutrient } from "~/api/server"

function formatValue(value: number) {
	return new Intl.NumberFormat("de-DE", {
		maximumFractionDigits: 2,
	}).format(value)
}

const NutrientRow: VoidComponent<{ nutrient: Nutrient }> = (props) => (
	<div class="flex items-baseline justify-between gap-4">
		<span class="text-[#5A554D]">{props.nutrient.label}</span>
		<span class="font-semibold tabular-nums text-[#5A554D]">
			{formatValue(props.nutrient.value)}
			<span class="ml-1 font-normal opacity-60">{props.nutrient.unit}</span>
		</span>
	</div>
)

const Chip: Component<{ label: string; class?: string }> = (props) => (
	<span
		class={cn(
			"rounded-[4px] px-2 py-1 font-noto text-[11px] font-semibold ring-inset ring-1 ring-black/10",
			props.class,
		)}>
		{props.label}
	</span>
)

const EntityList: VoidComponent<{
	title: string
	entities: LabeledEntity[]
}> = (props) => (
	<Show when={props.entities.length > 0}>
		<div>
			<p class="text-[11px] font-bold uppercase tracking-[4%] text-[#5A554D] opacity-70">
				{props.title}
			</p>
			<p class="text-[12px] leading-snug text-[#5A554D]">
				{props.entities.map((entity) => entity.name).join(", ")}
			</p>
		</div>
	</Show>
)

export const NutrientDrawer: VoidComponent<{
	name: string
	nutrients: Nutrient[]
	allergens: LabeledEntity[]
	additives: LabeledEntity[]
}> = (props) => {
	return (
		<Show when={props.nutrients.length > 0}>
			<Drawer>
				{(drawerProps) => (
					<>
						<Drawer.Trigger
							class="flex items-center bg-[#D3D6D4] px-2 py-1 rounded-[4px] font-noto text-[12px] gap-1 font-semibold text-[#3e3e3e] ring-inset ring-1 ring-black/10 transition-colors duration-100 hover:bg-[#c4c8c6] focus-visible:outline-none focus-visible:bg-corvu-200">
							Nährwerte
							<svg
								width="10"
								height="7"
								viewBox="0 0 10 7"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M5 6.477C4.735 6.477 4.481 6.372 4.293 6.184L0.293 2.184C-0.098 1.793 -0.098 1.161 0.293 0.77C0.684 0.379 1.316 0.379 1.707 0.77L5 4.063L8.293 0.77C8.684 0.379 9.316 0.379 9.707 0.77C10.098 1.161 10.098 1.793 9.707 2.184L5.707 6.184C5.519 6.372 5.265 6.477 5 6.477Z"
									fill="black"
									fill-opacity="0.5"
								/>
							</svg>
						</Drawer.Trigger>
						<Drawer.Portal>
							<Drawer.Overlay
								class="fixed inset-0 z-40 corvu-transitioning:transition-colors corvu-transitioning:duration-500"
								style={{
									"background-color": `rgb(0 0 0 / ${
										0.5 * drawerProps.openPercentage
									})`,
								}}
							/>
							<Drawer.Content
								class="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-xl rounded-t-xl bg-white font-noto shadow-lg outline-none corvu-transitioning:transition-transform corvu-transitioning:duration-500 corvu-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform">
								<div class="flex flex-col gap-4 p-4 pb-6">
									<div class="mx-auto h-1 w-10 rounded-full bg-black/10" />
									<Drawer.Label class="text-[13px] font-bold text-[#3e3e3e]">
										{props.name}
									</Drawer.Label>
									<div class="flex flex-col gap-1">
										<For each={props.nutrients}>{(nutrient) => <NutrientRow nutrient={nutrient} />}</For>
									</div>
									<div class="flex flex-col gap-2 border-t border-black/10 pt-3">
										<EntityList title="Allergene" entities={props.allergens} />
										<EntityList title="Zusatzstoffe" entities={props.additives} />
									</div>
								</div>
							</Drawer.Content>
						</Drawer.Portal>
					</>
				)}
			</Drawer>
		</Show>
	)
}

// Small neutral chips listing the allergens and additives of a dish on the card
export const AllergenAdditiveChips: VoidComponent<{
	allergens: LabeledEntity[]
	additives: LabeledEntity[]
}> = (props) => {
	const filteredAllergens = () =>
		props.allergens.filter((a) => !a.name.toLowerCase().includes("kein allergen"))
	const filteredAdditives = () =>
		props.additives.filter((a) => !a.name.toLowerCase().includes("kein zusatzstoff"))

	return (
		<Show when={filteredAllergens().length > 0 || filteredAdditives().length > 0}>
			<For each={filteredAllergens()}>
				{(allergen) => <Chip label={allergen.name} class="bg-white text-[#5A554D]" />}
			</For>
			<For each={filteredAdditives()}>
				{(additive) => <Chip label={additive.name} class="bg-white text-[#5A554D] opacity-70" />}
			</For>
		</Show>
	)
}
