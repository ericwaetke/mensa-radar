import { createMemo, VoidComponent } from "solid-js"
import { Logo } from "./Logo"
import { mensa } from "@/schema"
import { InferSelectModel } from "drizzle-orm"
import { ChevronUp } from "./icons"
import { A, useNavigate, useParams } from "@solidjs/router"

import { DatePicker } from "@ark-ui/solid/date-picker"
import { Index, Portal } from "solid-js/web"
import { MetaProvider, Title, Meta } from "@solidjs/meta"

export const HeaderRecipe: VoidComponent<{
	href: string
	mensa?: InferSelectModel<typeof mensa>
	recipeName?: string
}> = (props) => {
	return (
		<div class="bg-white">
			<MetaProvider>
				<Title>
					{props.recipeName} · {props.mensa?.name} · Mensa Radar
				</Title>
				<Meta
					property="og:image"
					content="https://mensa-radar.de/og.png"
				/>
			</MetaProvider>
			<div class="w-full px-4 pb-2 pt-16 flex flex-col justify-center gap-4 max-w-5xl mx-auto">
				<A
					href={props.href}
					class="flex w-full justify-between items-center">
					<ChevronUp class="-rotate-90" />
					<h1 class="text-[18px] font-bold max-w-[90%]">
						{props.recipeName}
					</h1>
					<div />
				</A>
			</div>
		</div>
	)
}
