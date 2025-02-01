import { createAsync, type RouteDefinition, useParams } from "@solidjs/router"
import {
	createEffect,
	createMemo,
	createResource,
	createSignal,
	ErrorBoundary,
	For,
	Show,
	Suspense,
} from "solid-js"
import { getMensa, getMensas, getServings } from "~/api"
import { HeaderMensa } from "~/components/HeaderMensa"
import { Serving } from "~/components/Serving"

import * as Sentry from "@sentry/solidstart";
const SentryErrorBoundary = Sentry.withSentryErrorBoundary(ErrorBoundary);

export default function Home() {
	const params = useParams()
	// Parse Date from format: "DD-MM-YYYY"
	function parseDate(date: string): string {
		const [day, month, year] = date.split("-")
		// '2024-10-10 22:00:00+00'

		// throw new Error("Not implemented")

		return `${year}-${month}-${day}`
	}

	const servings = createAsync(
		() => getServings(params.mensa, parseDate(params.date), "de"),
		{
			deferStream: true,
		}
	)

	const mensa = createAsync(() => getMensa(params.mensa), {
		deferStream: true,
	})

	return (
		<SentryErrorBoundary
			fallback={(err) => <div>Error: {err.message}</div>}
		>
			<main class="h-full min-h-screen w-full font-bespoke">
				<HeaderMensa mensa={mensa()?.mensa} />

				<div class="flex gap-3 mx-auto max-w-5xl p-4">
					<Show
						when={servings() && servings()!.length > 0}
						fallback={
							<>
								<div class="flex flex-col items-center w-full gap-4 py-20">
									<div class="flex flex-col items-center">
										<p class="font-bespoke text-left font-bold text-xl bg-white p-4 rounded-xl">
											Leider gibt es
											<br />
											an diesem Tag
											<br />
											kein Essen :(
										</p>
										<svg
											width="15"
											height="11"
											viewBox="0 0 15 11"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M7.5 11L15 -2.38419e-07H0L7.5 11Z"
												fill="white"
											/>
										</svg>
									</div>
									<svg
										width="149"
										height="149"
										viewBox="0 0 149 149"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M32 128.5L20 109.5V64L25.5 28.5L44.5 13L83 2.5L109.5 13L128 34.5L131 58V87L128 113.5L107 138L63 144L32 128.5Z"
											fill="#C5FFD4"
										/>
										<path
											opacity="0.9"
											d="M115 81.4674C105.003 73.1621 91.0001 68 75.5 68C60.2566 68 46.4615 72.9925 36.5 81.0573"
											stroke="#424242"
											stroke-width="8"
										/>
										<path
											d="M130.5 47.5C130.5 70.7582 106.729 91 75.5 91C44.271 91 20.5 70.7582 20.5 47.5C20.5 24.2418 44.271 4 75.5 4C106.729 4 130.5 24.2418 130.5 47.5Z"
											stroke="black"
											stroke-width="8"
										/>
										<g filter="url(#filter0_i_88_1198)">
											<path
												d="M130.5 100C130.5 124.455 105.876 144.28 75.5 144.28C45.1243 144.28 20.5 124.455 20.5 100"
												stroke="black"
												stroke-width="8"
											/>
										</g>
										<path
											d="M127.5 76C136.889 76 144.5 68.3888 144.5 59C144.5 49.6112 136.889 42 127.5 42"
											stroke="black"
											stroke-width="8"
										/>
										<path
											d="M21.5 76C12.1112 76 4.5 68.3888 4.5 59C4.5 49.6112 12.1112 42 21.5 42"
											stroke="black"
											stroke-width="8"
										/>
										<line
											x1="130.5"
											y1="100"
											x2="130.5"
											y2="47"
											stroke="black"
											stroke-width="8"
										/>
										<line
											x1="20.5"
											y1="100"
											x2="20.5"
											y2="47"
											stroke="black"
											stroke-width="8"
										/>
										<defs>
											<filter
												id="filter0_i_88_1198"
												x="16.5"
												y="100"
												width="118"
												height="48.2798"
												filterUnits="userSpaceOnUse"
												color-interpolation-filters="sRGB">
												<feFlood
													flood-opacity="0"
													result="BackgroundImageFix"
												/>
												<feBlend
													mode="normal"
													in="SourceGraphic"
													in2="BackgroundImageFix"
													result="shape"
												/>
												<feColorMatrix
													in="SourceAlpha"
													type="matrix"
													values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
													result="hardAlpha"
												/>
												<feOffset />
												<feGaussianBlur stdDeviation="17.5" />
												<feComposite
													in2="hardAlpha"
													operator="arithmetic"
													k2="-1"
													k3="1"
												/>
												<feColorMatrix
													type="matrix"
													values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
												/>
												<feBlend
													mode="normal"
													in2="shape"
													result="effect1_innerShadow_88_1198"
												/>
											</filter>
										</defs>
									</svg>
								</div>
							</>
						}>
						<For each={[0, 1]}>
							{(j) => (
								<div class="flex basis-1/2 flex-col gap-3">
									<For each={servings()}>
										{(serving, i) =>
											i() % 2 === j && (
												<Serving
													name={serving.recipe.name}
													priceStudents={
														serving.recipe
															.price_students
													}
													priceEmployees={
														serving.recipe
															.price_employees
													}
													priceGuests={
														serving.recipe.price_guests
													}
													features={serving.features}
												/>
											)
										}
									</For>
								</div>
							)}
						</For>
					</Show>
				</div>
			</main>
		</SentryErrorBoundary>
	)
}
