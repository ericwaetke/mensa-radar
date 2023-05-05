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
		<div className="h-screen bg-light-green">
			<div className="m-auto flex h-full max-w-lg flex-col space-y-6 overflow-scroll">
				<div className=" border-b border-gray/20">
					<div 
						className="flex cursor-pointer items-center justify-center px-8 py-6 text-xl"
						onClick={() => setModalOpen(false)}>
						<img src="/icons/right-arrw.svg" className="mr-auto w-4 rotate-180" />	
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
								<div key={index} className="flex flex-col divide-y divide-gray/20 border-b border-gray/20 first:border-0">
									<div className="flex w-full flex-row space-x-4 px-4 py-2 font-serif-med text-sm">
										<p className="w-3/12 grow-0"></p>
										<p className="w-3/12 grow">{getShortFoodName(index)}</p>
										
										{
											twoAvailable ? (
												<p className="w-3/12 grow">{getShortFoodName(index + 1) }</p>
											) : <div className="w-3/12 grow"></div>
										}
									</div>
									{
										notSoldOutFoodOffers[index].nutrients.map((nutrient, i) => {

											return (
												<div className="flex w-full flex-row items-center justify-between space-x-4 px-4 py-3 text-sm">
													<p className="w-3/12 grow-0 break-words font-sans-med text-gray/50">
														{ nutrientType[notSoldOutFoodOffers[index].nutrients[i].name].name }
													</p>
													<NutrientComponent nutrient={notSoldOutFoodOffers[index].nutrients[i]} />
													{
														twoAvailable ? (
															<NutrientComponent nutrient={notSoldOutFoodOffers[index + 1].nutrients[i]} />
														) : <div className="w-3/12 grow"></div>
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
				<p className="px-4 font-sans-reg text-gray/50">Verglichen mit dem Tagesbedarf <br/> für durchschnittliche Person lt. DGE</p>

			</div>
		</div>	
	)
}