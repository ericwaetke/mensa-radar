import { VoidComponent } from "solid-js"
import { Logo } from "./Logo"
import { Meta, MetaProvider, Title } from "@solidjs/meta"

export const Header: VoidComponent = () => {
	return (
		<div class="bg-white">
			<div class="bg-white w-full px-2 pb-2 pt-16 flex flex-row justify-center max-w-5xl mx-auto">
				<MetaProvider>
					<Title>Mensa Radar</Title>
					<Meta
						property="og:image"
						content="https://mensa-radar.de/og.png"
					/>
				</MetaProvider>
				<Logo />
			</div>
		</div>
	)
}
