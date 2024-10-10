import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { createEffect, createSignal, For, Show, Suspense } from "solid-js";
import { getMensa, getMensas, getServings } from "~/api";
import { Serving } from "~/components/Serving";

export const route = {
	preload() {
		// getServings();
	},
} satisfies RouteDefinition;

export default function Home() {
	const params = useParams();
	// Parse Date from format: "DD-MM-YYYY"
	function parseDate(date: string): string {
		const [day, month, year] = date.split("-");
		// '2024-10-10 22:00:00+00'

		return `${year}-${month}-${day} 22:00:00+00`;
	}
	const date = parseDate(params.date);
	const servings = createAsync(
		async () => getServings(params.mensa, date, "de"),
		{ deferStream: true },
	);

	const mensa = createAsync(() => getMensa(params.mensa), {
		deferStream: true,
	});

	return (
		<main class="mx-auto h-full min-h-screen w-full max-w-5xl p-4 font-bespoke">
			<a href="/" class="flex gap-2">
				&lt;{" "}
				<Suspense fallback={<div>Loading...</div>}>
					{mensa()?.name}
				</Suspense>
			</a>

			<div class="flex gap-3">
				<For each={[0, 1]}>
					{(j) => (
						<div class="flex basis-1/2 flex-col gap-3">
							<For
								each={servings()}
								fallback={<div>Loading...</div>}
							>
								{(serving, i) =>
									i() % 2 === j && (
										<Serving
											name={serving.recipe.name}
											priceStudents={
												serving.recipe.price_students
											}
											priceEmployees={
												serving.recipe.price_employees
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
			</div>
		</main>
	);
}
