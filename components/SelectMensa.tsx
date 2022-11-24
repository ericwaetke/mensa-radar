import { motion } from "framer-motion"
import Link from "next/link"
import { Router, useRouter } from "next/router"

export const SelectMensa = (
	{
		setModalOpen,

		currentMensa,
		mensen
	}: {
		setModalOpen: (open: boolean) => void,

		currentMensa: string | string[],
		mensen: {
			id: number,
			name: string,
			url: string,
			open: boolean,
			openingString: string,
		}[]
	}
) => {

	const selectedMensa = mensen.find(m => m.url == currentMensa)

	const router = useRouter()
	const routeTo = (mensa: string) => {
		setModalOpen(false)
		router.push(`/mensa/${mensa}`)
	}

	return (
		<>
		<motion.div 
		initial={{height: "62px"}}
		animate={{height: "auto"}}
		// transition={{duration: .5}}
		className="flex flex-col divide-y divide-gray/20 border border-gray/20 rounded-xl bg-white overflow-hidden">
			{/* Showing current Mensa */}
			<div 
				onClick={() => setModalOpen(false)}
				className="flex p-4 justify-between space-x-2 bg-light-green items-center cursor-pointer">
				<h3 className="text-xl font-normal font-serif-med">{selectedMensa.name}</h3>
				<div className="flex font-sans-reg text-s items-center">
					<svg className="h-2" viewBox="0 0 22 13" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M2 1.5L11 10.5L20 1.5" stroke="black" stroke-width="3"/>
					</svg>
				</div>
			</div>
			{
				Object.values(mensen).map((mensa) => {
					return mensa.url !== currentMensa ? (
						<div 
							onClick={() => routeTo(mensa.url)}
							className={`flex p-4 justify-between space-x-2 items-center`}>
							<h3 className="text-xl font-normal font-serif-med"> {mensa.name}</h3>
							<div className="flex font-sans-reg text-s items-center h-full">
								{
									mensa.open || mensa.openingString === "offen bis 14:30" ? <>
										<div className="rounded-full w-2 h-2 bg-main-green mr-2 my-auto"></div>
									</> : null
								}

								<span className="opacity-60 whitespace-nowrap"> {mensa.openingString} </span>
							</div>
						</div>
					) : null
				})
			}
		</motion.div>
		</>
	)
}