import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For } from "solid-js";
import { getMensas } from "~/api";

export const route = {
  preload() {
    getMensas();
  }
} satisfies RouteDefinition;

export default function Home() {
  const mensas = createAsync(async () => getMensas(), { deferStream: true });

  // Format the date in the format "DD-MM-YYYY"
  const currentDateTime = new Date();
  const formattedDate = `${currentDateTime.getDate()}-${currentDateTime.getMonth() + 1}-${currentDateTime.getFullYear()}`;

  return (
    <main class="w-full p-4 bg-[#DDEDE2] h-full min-h-screen">
      <div class="rounded-xl overflow-clip">
        <For each={mensas()} fallback={<div>Loading...</div>}>
          {(mensa) => (
            <a class="p-4 bg-white flex" href={`${mensa.mensa_provider.slug}/${mensa.mensa.slug}/${formattedDate}`}>
              <h4 class="font-bold text-lg">{mensa.mensa.name}</h4>
              <p>{mensa.mensa.address_city}</p>
            </a>
          )}
          </For>
        </div>
    </main>
  );
}
