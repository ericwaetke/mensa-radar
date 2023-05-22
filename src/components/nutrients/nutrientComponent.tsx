import { motion } from "framer-motion"

export const nutrientType = {
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

export const NutrientComponent = ({nutrient}) => {

	const kJToKcal = (kj) => {
		return Math.round((kj / 4.184) * 100) / 100
	}

	const nutrientData = nutrient ? {
		...nutrientType[nutrient.name],
		value: nutrient.name === "Energie (Kilojoule)" ? kJToKcal(nutrient.value) : parseFloat(nutrient.value),
		unit: nutrient.name === "Energie (Kilojoule)" ? "kcal" : nutrient.unit,
	} : {
		value: "",
		unit: ""
	}

	// In Float Percentage from 0 to 1
	const actualBarWitdh = nutrientData.value / nutrientData.reference * 100
	const barWidth = actualBarWitdh > 100 ? 100 : actualBarWitdh;

	return (
		<div className="flex w-4/12 grow flex-col space-y-1">

			<p className="font-sans-med">{nutrientData.value} {nutrientData.unit}</p>
			<div className='relative h-2 w-full rounded-full'>

				<motion.div className='absolute h-2 rounded-full bg-main-green' 
					initial={{width: 0}}
					animate={{width:
					`${barWidth}%`
					}}
					transition={{duration: .5}}></motion.div>
			</div>
		</div>
	)
}