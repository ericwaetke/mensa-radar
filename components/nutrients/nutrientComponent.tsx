import { motion } from "framer-motion"

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

	// In Float Percentage from 0 to 1
	const barPosition = .1

	return (
		<div className="w-f flex flex-col gap-2" key={nutrientData.name} style={{gridArea: nutrientData.name}}>
			
			<div className="flex justify-between">
				<p className='text-sm font-medium font-serif'>
					{nutrientData.name}
				</p>
				<p className='text-sm font-medium opacity-50'>
					{`${nutrientData.value}${nutrientData.unit}`}
				</p>
			</div>

			<div className='h-1.5 w-full bg-white relative rounded-full'>
				<motion.div className='h-1.5 bg-sec-green-dark absolute border-r-2 border-custom-bg rounded-full' 
				initial={{width: 0}}
				animate={{width: `${nutrientData.value / (nutrientData.reference * (1 + barPosition)) * 100}%`}}
				transition={{duration: .5}}></motion.div>

				<div className='h-4 w-1 bg-main-black absolute border-r-2 border-main-white rounded-full' 
				style={{
					top: "-6px", 
					right: `${nutrientData.reference * (1 + barPosition) / nutrientData.reference * barPosition * 100 }%`}}></div>
			</div>
		</div>
	)
}