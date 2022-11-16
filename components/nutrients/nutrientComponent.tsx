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
		value: nutrient.name === "Energie (Kilojoule)" ? kJToKcal(nutrient.value) : parseFloat(nutrient.value),
	}
	console.log(nutrientData)

	// In Float Percentage from 0 to 1
	const barPosition = .1
	const barWidth = nutrientData.reference / nutrientData.value > 10 ? 100 : nutrientData.reference / nutrientData.value * 10;

	return (
		<div className="w-5/12 flex flex-col space-y-1">
			<p className="w-5/12 font-sans-med">{nutrient.value} {nutrient.unit}</p>
			<div className='h-2 w-full  rounded-full'>
				<motion.div className='h-2 bg-main-green absolute rounded-full' 
				initial={{width: 0}}
				animate={{width:
					`${barWidth}%`
				}}
				transition={{duration: .5}}></motion.div>
			</div>
		</div>
	)
}