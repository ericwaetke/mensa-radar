import { NutrientComponent, nutrientType } from "./nutrientComponent"


export const NutrientOverview = ({foodOffers, setModalOpen}) => {

	const getShortFoodName = (index: number) => {
		let foodTitle = foodOffers[index].food_title;
		//cut string to 80  
		let foodTitleTrim = foodTitle.substr(0, 60);
		//cut string where last space is
		foodTitleTrim = foodTitleTrim.substr(0, Math.min(foodTitleTrim.length, foodTitleTrim.lastIndexOf(" ")))
		//if comma is at the end, remove
		if(foodTitleTrim[foodTitleTrim.length-1] === ",") foodTitleTrim = foodTitleTrim.substring(0, foodTitleTrim.length-1);
		//add ellipsis
		foodTitleTrim += "…";
		return foodTitleTrim;
	}

	return (
		<div className="max-w-lg m-auto space-y-4 flex flex-col bg-light-green h-full overflow-scroll">
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
									<p className="w-4/12"></p>
									<p className="w-4/12">{getShortFoodName(index)}</p>
									
									{
										twoAvailable ? (
											<p className="w-4/12">{getShortFoodName(index + 1) }</p>
										) : <div className="w-4/12 flex flex-col space-y-1"></div>
									}
								</div>
								{
									foodOffers[index].nutrients.map((nutrient, i) => {

										return (
											<div className="flex space-x-4 flex-row w-full items-center justify-between text-sm py-3 px-4">
												<p className="w-4/12 font-sans-bold break-words text-gray/50">
												{nutrientType[foodOffers[index].nutrients[i].name].name}</p>
												<NutrientComponent nutrient={foodOffers[index].nutrients[i]} />
												{
													twoAvailable ? (
														<NutrientComponent nutrient={foodOffers[index + 1].nutrients[i]} />
													) : <div className="w-4/12 flex flex-col space-y-1"></div>
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