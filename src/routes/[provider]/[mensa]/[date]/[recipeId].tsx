import { createAsync, useParams } from "@solidjs/router"
import { For, Show } from "solid-js"
import { getMensa, getRecipes, getServings } from "~/api"
import { getRecipe } from "~/api/server"
import { HeaderMensa } from "~/components/HeaderMensa"
import { HeaderRecipe } from "~/components/HeaderRecipe"
import { Serving } from "~/components/Serving"
import { Price } from "~/components/Serving/Price"

export default function Home() {
	const params = useParams()
	const { provider, date, recipeId } = params

	const recipe = createAsync(() => getRecipe(parseInt(recipeId), "de"), {
		deferStream: true,
	})
	console.log(recipe())

	const mensa = createAsync(() => getMensa(params.mensa), {
		deferStream: true,
	})

	return (
		<main class="h-full min-h-screen w-full font-bespoke">
			<HeaderRecipe
				mensa={mensa()?.mensa}
				recipeName={recipe()?.name}
				href={`/${provider}/${params.mensa}/${date}`}
			/>

			<div class="flex gap-4 mx-auto max-w-5xl p-4 flex-col">
				<Show
					when={recipe()}
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
							</div>
						</>
					}>
					<div class="border-2 rounded-md border-black/20 w-[216px] h-[116px] items-center justify-center gap-1 flex flex-col font-noto font-bold text-sm text-black/20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="34"
							height="26"
							viewBox="0 0 34 26"
							fill="none">
							<path
								opacity="0.25"
								d="M4.94691 26C3.49275 26 2.38571 25.6224 1.6258 24.8671C0.875267 24.1213 0.5 23.0214 0.5 21.5675V7.50545C0.5 6.05156 0.875267 4.95171 1.6258 4.20588C2.38571 3.45062 3.49275 3.07298 4.94691 3.07298H8.4791C8.98571 3.07298 9.36567 3.01634 9.61898 2.90305C9.88166 2.78032 10.1772 2.54902 10.5055 2.20915L11.561 1.09041C11.9081 0.731663 12.2834 0.4626 12.6868 0.283224C13.0996 0.0944081 13.6437 0 14.3192 0H19.6104C20.2859 0 20.8254 0.0944081 21.2288 0.283224C21.6416 0.4626 22.0215 0.731663 22.3687 1.09041L23.4241 2.20915C23.6399 2.43573 23.8369 2.61038 24.0151 2.73312C24.1934 2.85585 24.3904 2.94553 24.6062 3.00218C24.8313 3.04938 25.1175 3.07298 25.4646 3.07298H29.039C30.4932 3.07298 31.6002 3.45062 32.3601 4.20588C33.12 4.95171 33.5 6.05156 33.5 7.50545V21.5675C33.5 23.0214 33.12 24.1213 32.3601 24.8671C31.6002 25.6224 30.4932 26 29.039 26H4.94691ZM5.158 23.1819H28.8279C29.4284 23.1819 29.8881 23.0261 30.207 22.7146C30.526 22.403 30.6855 21.931 30.6855 21.2985V7.77451C30.6855 7.14198 30.526 6.67465 30.207 6.37255C29.8881 6.061 29.4284 5.90523 28.8279 5.90523H24.6062C24.0151 5.90523 23.5367 5.83914 23.1708 5.70697C22.8143 5.5748 22.4719 5.32462 22.1435 4.95643L21.1162 3.83769C20.7597 3.44118 20.4313 3.17683 20.1311 3.04466C19.8403 2.90305 19.4041 2.83224 18.8224 2.83224H15.1073C14.535 2.83224 14.0987 2.90305 13.7985 3.04466C13.4983 3.17683 13.1652 3.4459 12.7994 3.85185L11.8002 4.95643C11.4625 5.32462 11.1154 5.5748 10.7588 5.70697C10.4023 5.83914 9.92388 5.90523 9.32345 5.90523H5.158C4.56695 5.90523 4.11194 6.061 3.79296 6.37255C3.48337 6.67465 3.32857 7.14198 3.32857 7.77451V21.2985C3.32857 21.931 3.48337 22.403 3.79296 22.7146C4.11194 23.0261 4.56695 23.1819 5.158 23.1819ZM17.007 21.4542C15.6842 21.4542 14.4787 21.1333 13.3904 20.4913C12.3021 19.8399 11.439 18.9713 10.8011 17.8856C10.1631 16.7999 9.84414 15.5868 9.84414 14.2462C9.84414 12.9056 10.1631 11.6924 10.8011 10.6068C11.439 9.51162 12.3021 8.64306 13.3904 8.00109C14.4787 7.34967 15.6842 7.02397 17.007 7.02397C18.3299 7.02397 19.5307 7.34967 20.6096 8.00109C21.6885 8.64306 22.5469 9.51162 23.1849 10.6068C23.8322 11.6924 24.1559 12.9056 24.1559 14.2462C24.1559 15.5868 23.8322 16.7999 23.1849 17.8856C22.5469 18.9713 21.6885 19.8399 20.6096 20.4913C19.5307 21.1333 18.3299 21.4542 17.007 21.4542ZM17.007 18.9052C17.8608 18.9052 18.6348 18.6975 19.329 18.2821C20.0232 17.8667 20.5768 17.305 20.9896 16.597C21.4117 15.8889 21.6228 15.1053 21.6228 14.2462C21.6228 13.3776 21.4117 12.5893 20.9896 11.8813C20.5768 11.1732 20.0232 10.6115 19.329 10.1961C18.6348 9.78068 17.8608 9.57298 17.007 9.57298C16.1533 9.57298 15.3746 9.78068 14.671 10.1961C13.9674 10.6115 13.4092 11.1732 12.9964 11.8813C12.5836 12.5893 12.3772 13.3776 12.3772 14.2462C12.3772 15.1053 12.5836 15.8889 12.9964 16.597C13.4186 17.305 13.9768 17.8667 14.671 18.2821C15.3746 18.6975 16.1533 18.9052 17.007 18.9052ZM24.578 9.47386C24.578 9.00182 24.7516 8.59114 25.0987 8.24183C25.4552 7.89252 25.868 7.71786 26.3371 7.71786C26.8062 7.71786 27.2143 7.89252 27.5614 8.24183C27.9085 8.59114 28.0821 9.00182 28.0821 9.47386C28.0821 9.96478 27.9085 10.3802 27.5614 10.72C27.2237 11.0599 26.8156 11.2298 26.3371 11.2298C25.8586 11.2298 25.4458 11.0646 25.0987 10.7342C24.7516 10.3943 24.578 9.97422 24.578 9.47386Z"
								fill="#161616"
							/>
						</svg>
						Bild aufnehmen
					</div>
					<div class="flex flex-wrap gap-[6px]">
						<Price
							pricePrimary={recipe()?.priceStudents}
							priceSecondary={recipe()?.priceGuests}
						/>
						{/* <For each={recipe()?.features}>
							{(feature) => (
								<div
									class={cn(
										"flex items-center bg-[#D3D6D4] text-[#3e3e3e] px-2 py-1 rounded-[4px] font-noto text-[12px] gap-1 font-semibold ring-inset ring-1 ring-black/10",
										feature
											.toLowerCase()
											.includes("vegan") &&
											"bg-[#33EFB3] text-[#354937]",
										(feature
											.toLowerCase()
											.includes("vegetarisch") ||
											feature
												.toLowerCase()
												.includes("vegetarian")) &&
											"bg-[#CBE288] text-[#444935]",
										meatStrings.some((item) =>
											feature
												.toLowerCase()
												.includes(item.toLowerCase())
										) && "bg-[#FFB0A6] text-[#493735]",
										fishStrings.some((item) =>
											feature
												.toLowerCase()
												.includes(item.toLowerCase())
										) && "bg-[#90D3FA] text-[#354149]"
									)}>
									{feature}
								</div>
							)}
						</For> */}
					</div>
					<div class="font-noto font-semibold text-[13px] flex flex-col gap-1.5">
						<h3>Allergene</h3>
						<div class="text-[#161616] opacity-50">
							{/* TODO: Insert Real Allergens */}
							<p>Glutenhaltiges Getreide</p>
						</div>
					</div>
					<div class="font-noto font-semibold text-[13px] flex flex-col gap-1.5">
						<h3>Nährwerte</h3>
						<div class="bg-white rounded-md py-2 px-4">
							{/* TODO: Insert Real Nutritions */}
							<p>Protein …</p>
						</div>
					</div>
					<div class="font-noto font-semibold text-[13px] flex flex-col gap-1.5">
						<h3>Im Angebot Bei</h3>
						<div class="bg-white rounded-md py-2 px-4">
							{/* TODO: Insert Real Alternative Offers */}
							<p>FHP …</p>
						</div>
					</div>
				</Show>
			</div>
		</main>
	)
}
