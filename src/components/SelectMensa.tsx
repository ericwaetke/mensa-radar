import { motion } from "framer-motion"
import Link from "next/link"

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

	return (
		<>
			<motion.div 
				initial={{height: "62px"}}
				animate={{height: "auto"}}
				// transition={{duration: .5}}
				className="w-96 flex flex-col divide-y divide-gray/20 border border-gray/20 rounded-xl bg-white overflow-hidden">
				{/* Showing current Mensa */}
				<div 
					onClick={() => setModalOpen(false)}
					className="flex h-12 space-x-1 justify-center bg-light-green items-center cursor-pointer">
					<h1 className="block text-h1 font-serif-bold">{selectedMensa.name}</h1>
					<img className="w-4 rotate-180" src="/icons/chev-down.svg"></img>
				</div>
				{
					Object.values(mensen).map((mensa) => {
						return mensa.url !== currentMensa ? (
							<Link href={`/mensa/${mensa.url}`}>
								<a className={`flex h-12 justify-center space-x-2 items-center`}>
									<h3 className="text-lg font-normal font-serif-med"> {mensa.name}</h3>
									<div className="flex font-sans-reg text-s items-center h-full">
										{
											mensa.open || mensa.openingString === "offen bis 14:30" ? <>
												<div className="rounded-full w-2 h-2 bg-main-green mr-2 my-auto"></div>
											</> : null
										}

										<span className="opacity-60 whitespace-nowrap"> {mensa.openingString} </span>
									</div>
								</a>
							</Link>
						) : null
					})
				}
			</motion.div>
		</>
	)
}