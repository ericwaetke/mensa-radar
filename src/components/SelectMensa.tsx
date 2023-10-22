import { motion } from "framer-motion"
import Link from "next/link"

export const SelectMensa = ({
	setModalOpen,

	currentMensa,
	mensen,
}: {
	setModalOpen: (open: boolean) => void

	currentMensa: string | string[]
	mensen: NewMensaData[]
}) => {
	const selectedMensa = mensen.find((m) => m.url == currentMensa)

	return (
		<>
			<div className="flex w-96 flex-col divide-y divide-gray/20 overflow-hidden rounded-xl border border-gray/20 bg-white">
				{/* Showing current Mensa */}
				<div
					onClick={() => setModalOpen(false)}
					className="flex h-12 cursor-pointer items-center justify-center space-x-1 bg-light-green"
				>
					<h1 className="text-h1 block font-serif-bold">
						{selectedMensa.name}
					</h1>
					<img
						className="w-4 rotate-180"
						src="/icons/chev-down.svg"
					></img>
				</div>
				{Object.values(mensen).map((mensa) => {
					return mensa.url !== currentMensa ? (
						<Link href={`/mensa/${mensa.url}`}>
							<a
								className={`flex h-12 items-center justify-center space-x-2`}
							>
								<h3 className="font-serif-med text-lg font-normal">
									{" "}
									{mensa.name}
								</h3>
								<div className="text-s flex h-full items-center font-sans-reg">
									{false && (
										<>
											<div className="my-auto mr-2 h-2 w-2 rounded-full bg-main-green"></div>
										</>
									)}

									<span className="whitespace-nowrap opacity-60">
										{/* {mensa.openingString} */}
									</span>
								</div>
							</a>
						</Link>
					) : null
				})}
			</div>
		</>
	)
}
