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
		<div className="px-2 pb-4 w-1/3 flex flex-col gap-2" key={nutrientData.name}>
			<p className='text-sm'>
			{`${nutrientData.value}${nutrientData.unit}`}
			</p>

			<div className='h-1 w-full bg-custom-light-gray relative rounded-full'>
				<div className='h-1 bg-custom-nutrient-red absolute border-r-2 border-custom-white' 
				style={{
					width: `${nutrientData.value / (nutrientData.reference * 1 + barPosition) * 100}%`}}></div>

				<div className='h-4 w-1 bg-custom-nutrient-stopper absolute border-r-2 border-custom-white' 
				style={{
					top: "-6px", 
					right: `${nutrientData.reference * 1 + barPosition / nutrientData.reference * barPosition * 100 }%`}}></div>
			</div>
			<p className='text-sm font-serif'>
				{nutrientData.name}
			</p>
		</div>
	)
}