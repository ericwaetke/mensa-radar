import { A } from "solid-start"

const Footer = () => {
	return (
		<footer class="fixed bottom-0 h-10 w-full border-t border-sec-kontur px-3 py-2">
			<div class="mx-auto grid max-w-xl grid-cols-2">
				<div class="flex flex-row space-x-2">
					<A
						class="font-sans text-sm opacity-50 font-semibold"
						href="/impressum">
						Über Mensa-Radar
					</A>
				</div>

				<div class="flex flex-row-reverse space-x-2">
					<p class="font-sans text-sm opacity-50 font-semibold">
						woven
					</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
