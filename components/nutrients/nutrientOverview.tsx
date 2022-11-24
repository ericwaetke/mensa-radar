import { NutrientComponent } from "./nutrientComponent"

const nutrientType = {
	"Eiweiß (Protein)": {
		name: "Eiweiß",
		reference: 72,
		unit: "g"
	},
	"Kohlenhydrate, resorbierbar": {
		name: "Kohlenhydrate",
		reference: 264,
		unit: "g"
	},
	"Fett": {
		name: "Fett",
		reference: 66,
		unit: "g"
	},
	"Energie (Kilojoule)": {
		name: "Energie",
		reference: 2000,
		unit: "kcal"
	}
}

export const NutrientOverview = ({foodOffers, setModalOpen}) => {
	return (
		<div className="space-y-4 flex flex-col bg-light-green h-full overflow-scroll">
					
			<div className="border-y border-gray/20">
				<div 
					className="flex py-6 justify-center items-center text-xl cursor-pointer px-8"
					onClick={() => setModalOpen(false)}>
					<img src="/icons/right-arrw.svg" className="rotate-180 mr-auto w-4" />	
					<h2 className="font-sans-bold">
						Nährwerte
					</h2>
					<div className="ml-auto"></div>
				</div>
			</div>
			

			{
				foodOffers.map((foodOffer, index) => {
					const twoAvailable = index < foodOffers.length - 1

					if (index % 2 === 0) {
						return (
							<div className="flex flex-col divide-y divide-gray/20 border-b border-gray/20">
								<div className="flex space-x-4 flex-row w-full font-serif-med text-sm py-2 px-4">
									<p className="w-2/12"></p>
									<p className="w-5/12">{foodOffers[index].food_title}</p>
									{
										twoAvailable ? (
											<p className="w-5/12">{foodOffers[index + 1].food_title}</p>
										) : null
									}
								</div>
								{
									foodOffers[index].nutrients.map((nutrient, i) => {

										return (
											<div className="flex space-x-4 flex-row w-full items-center justify-between text-sm py-3 px-4">
												<p className="w-2/12 font-sans-bold">{foodOffers[index].nutrients[i].name}</p>
												<NutrientComponent nutrient={foodOffers[index].nutrients[i]} />
												{
													twoAvailable ? (
														<NutrientComponent nutrient={foodOffers[index + 1].nutrients[i]} />
													) : null
												}
											</div>
										)
									})
								}
							</div>
						)
					}
					return null
				})
			}
		</div>

	)
}