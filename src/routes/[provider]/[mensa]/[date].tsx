import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { createEffect, createSignal, For, Show, Suspense } from "solid-js";
import { getMensas, getServings } from "~/api";
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
	createEffect(() => {
		if (!servings() || !servings()![0]) return;
		setMensa(servings()![0].mensa);
	});

	const [mensa, setMensa] = createSignal<{
		id: number;
		updated_at: string;
		created_at: string;
		name: string;
		slug: string | null;
		description: unknown;
		address_latitude: string;
		address_longitude: string;
		address_street: string | null;
		address_house_number: string | null;
		address_zip_code: string | null;
		address_city: string | null;
		provider_id: number | null;
	}>();

	return (
		<main class="mx-auto h-full min-h-screen w-full max-w-5xl p-4 font-bespoke">
			<a href="/" class="flex gap-2">
				&lt; <h1 class="text-2xl font-semibold">{mensa()?.name}</h1>
			</a>

			<div class="flex gap-3">
				<div class="flex basis-1/2 flex-col gap-3">
					<For each={servings()} fallback={<div>Loading...</div>}>
						{(serving, i) =>
							i() % 2 === 0 && (
								<Serving name={serving.recipes_locales?.name} />
							)
						}
					</For>
				</div>
				<div class="flex basis-1/2 flex-col gap-3">
					<For each={servings()} fallback={<div>Loading...</div>}>
						{(serving, i) =>
							i() % 2 !== 0 && (
								<Serving name={serving.recipes_locales?.name} />
							)
						}
					</For>
				</div>
			</div>
		</main>
	);
}
