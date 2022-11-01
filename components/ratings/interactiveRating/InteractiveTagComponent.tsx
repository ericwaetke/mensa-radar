import { m, motion } from "framer-motion"

export const InteractiveTagComponent = (
	{
		qualityRating,
		selected,
		handleUserTagSelection
	}: 
	{
		qualityRating: 0|1|2|3,
		selected: string[],
		handleUserTagSelection: (tag: string) => void
	}) => {

	const defaultTags = {
		0: [],
		1: [
			"fad",
			"zu scharf",
			"schlecht gewürzt",
			"überkocht",
			"unterkocht",
			"zu fettig",
			"sauer",
			"trocken",
			"zu viel",
			"zu wenig"
		],
		2: [
			"zu viel",
			"zu wenig",
			"richtige Menge",
			"wie erwartet",

		],
		3: [
			"unlgaublich",
			"al dente",
			"überkocht",
			"gut gewürzt",
			"tolle Sauce",
			"süß",
			"zart",
			"zu viel",
			"zu wenig"
		]
	}

	const container = {
		hidden: { opacity: 1 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.5
			}
		}
	}
	const tagAnimation = {
		hidden: { opacity: 0, scale: 0, y: 10 },
		show: {
			opacity: 1,
			scale: 1,
			y: 0,
		}
	}


	return (
		<motion.div className="text-center"
		variants={container}
			initial="hidden"
			animate="show">
			{
				defaultTags[qualityRating].map((tag, index) => {
					return (
						<motion.div 
						className={`px-2 border inline-flex rounded-full m-1 ${selected.includes(tag) ? 'bg-main-green border-main-green' : 'border-main-black'}`} 
						key={index}
						variants={tagAnimation} 
						onClick={() => handleUserTagSelection(tag)}>
								{tag}
						</motion.div>
					)
				})
			}
		</motion.div>
	)
}