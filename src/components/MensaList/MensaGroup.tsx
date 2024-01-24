import Disclosure from "corvu/disclosure"
import { For } from "solid-js"
import MensaListItem from "./MensaListItem"

export default function MensaGroup(props: { items?: number }) {
	return (
		<div class="flex flex-col gap-2">
			<Disclosure.Root collapseBehavior="hide" initialExpanded="true">
				<Disclosure.Trigger class="w-full">
					<h2 class="font-sans font-bold text-base tracking-wide text-sec-light-text uppercase text-center">
						Berlin
					</h2>
				</Disclosure.Trigger>
				<Disclosure.Content class="overflow-clip corvu-expanded:animate-expand corvu-collapsed:animate-collapse bg-white rounded-xl divide-y divide-sec-kontur">
					<For each={[...Array(props.items ?? 1).keys()]}>
						{(item) => <MensaListItem />}
					</For>
				</Disclosure.Content>
			</Disclosure.Root>
		</div>
	)
}
