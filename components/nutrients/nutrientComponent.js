export const NutrientComponent = ({nutrient}) => {

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

	const kJToKcal = (kj) => {
		return Math.round((kj / 4.184) * 100) / 100
	}

	const nutrientData = {
		...nutrientType[nutrient.name],
		value: nutrient.name == "Energie (Kilojoule)" ? kJToKcal(nutrient.value) : nutrient.value,
	}
	console.log(nutrientData)

	// In Float Percentage from 0 to 1
	const barPosition = .1

	return (
		<div className="w-f flex flex-col gap-2" key={nutrientData.name} style={{gridArea: nutrientData.name}}>
			<p className='text-sm font-serif'>
				{nutrientData.name}
			</p>

			<div className='h-1.5 w-full bg-custom-light-gray relative rounded-full'>
				<div className='h-1.5 bg-custom-dark-green absolute border-r-2 border-custom-white rounded-full' 
				style={{
					width: `${nutrientData.value / (nutrientData.reference * (1 + barPosition)) * 100}%`}}></div>

				<div className='h-4 w-1 bg-custom-black absolute border-r-2 border-custom-white rounded-full' 
				style={{
					top: "-6px", 
					right: `${nutrientData.reference * (1 + barPosition) / nutrientData.reference * barPosition * 100 }%`}}></div>
			</div>

			<p className='text-sm font-bold opacity-50'>
				{`${nutrientData.value}${nutrientData.unit}`}
			</p>
		</div>
	)
}