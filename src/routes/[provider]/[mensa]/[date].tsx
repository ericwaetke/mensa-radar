import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { For } from "solid-js";
import { getMensas, getServings } from "~/api";

export const route = {
  preload() {
    getServings();
  }
} satisfies RouteDefinition;

export default function Home() {
  const params = useParams();
  const servings = createAsync(async () => getServings(params.mensa), { deferStream: true });
  console.log(servings())

  // Parse Date from format: "DD-MM-YYYY"
  function parseDate(date: string) {
    const [day, month, year] = date.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  const date = parseDate(params.date)
  console.log(date)

  return (
    <main class="w-full p-4 space-y-2">
      <For each={servings()} fallback={<div>Loading...</div>}>
        {(serving) => (
          <div class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold">{serving.servings.date}</h2>
            <p class="text-gray-500">{serving.recipes_locales?.name}</p>
          </div>
        )}
        </For>

    </main>
  );
}
