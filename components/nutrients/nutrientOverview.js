import { NutrientComponent } from "./nutrientComponent"

export const NutrientOverview = ({nutrients}) => {
	return (
		<div className="py-4">
			<p className="px-8 pb-4 font-bold text-sm text-custom-black uppercase">Nährwerte</p>
			
			<div className='px-8 flex flex-none break-all gap-2 lg:gap-8' style={{display: "grid", gridTemplateAreas: "'Eiweiß Kohlenhydrate''Fett Energie'"}}>
				{nutrients.map((nutrient, i) => <NutrientComponent nutrient={nutrient} key={i}/>)}
			</div>

			<div className="px-8 py-2">
				<div className='h-4 w-1 bg-main-black absolute border-r-2 border-main-white rounded-full my-1'></div>
				
				<p className='px-2 text-sm opacity-40 italic font-serif'>Verglichen nach dem Tagesbedarf der Optimalen Nährwerteverteilung nach DGE</p>
			</div>
		</div>

	)
}