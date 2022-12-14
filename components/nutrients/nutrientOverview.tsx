import { useMemo } from "react";
import { NutrientComponent, nutrientType } from "./nutrientComponent"


export const NutrientOverview = ({foodOffers, setModalOpen}) => {

	const notSoldOutFoodOffers = useMemo(() => foodOffers.filter(foodOffer => foodOffer.sold_out === false), [foodOffers])

	const getShortFoodName = (index: number) => {
		let foodTitle = notSoldOutFoodOffers[index].food_title;
		//cut string to 80  
		let foodTitleTrim = foodTitle.substr(0, 40);
		//cut string where last space is
		foodTitleTrim = foodTitleTrim.substr(0, Math.min(foodTitleTrim.length, foodTitleTrim.lastIndexOf(" ")))
		//if comma is at the end, remove
		if(foodTitleTrim[foodTitleTrim.length-1] === ",") foodTitleTrim = foodTitleTrim.substring(0, foodTitleTrim.length-1);
		//add ellipsis
		foodTitleTrim += "…";
		return index+1 + " " + foodTitleTrim;
	}

	return (
		<div className="bg-light-green h-screen">
			<div className="max-w-lg m-auto space-y-6 flex flex-col h-full overflow-scroll">
				<div className=" border-b border-gray/20">
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
					notSoldOutFoodOffers.map((foodOffer, index) => {
						const twoAvailable = index < notSoldOutFoodOffers.length - 1

						if (index % 2 === 0) {
							return (
								<div key={index} className="flex flex-col divide-y divide-gray/20 border-b first:border-0 border-gray/20">
									<div className="flex space-x-4 flex-row w-full font-serif-med text-sm py-2 px-4">
										<p className="w-3/12 grow-0"></p>
										<p className="grow w-3/12">{getShortFoodName(index)}</p>
										
										{
											twoAvailable ? (
												<p className="grow w-3/12">{getShortFoodName(index + 1) }</p>
											) : <div className="grow w-3/12"></div>
										}
									</div>
									{
										notSoldOutFoodOffers[index].nutrients.map((nutrient, i) => {

											return (
												<div className="flex space-x-4 flex-row w-full items-center justify-between text-sm py-3 px-4">
													<p className="w-3/12 font-sans-med break-words text-gray/50 grow-0">
														{ nutrientType[notSoldOutFoodOffers[index].nutrients[i].name].name }
													</p>
													<NutrientComponent nutrient={notSoldOutFoodOffers[index].nutrients[i]} />
													{
														twoAvailable ? (
															<NutrientComponent nutrient={notSoldOutFoodOffers[index + 1].nutrients[i]} />
														) : <div className="grow w-3/12"></div>
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
				<p className="font-sans-reg px-4 text-gray/50">Verglichen mit dem Tagesbedarf <br/> für durchschnittliche Person lt. DGE</p>

			</div>
		</div>	
	)
}