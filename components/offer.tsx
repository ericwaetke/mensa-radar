import { motion } from "framer-motion"
import Link from "next/link"
import { Pill } from "./pill"

export const Offer = (
	{
		offer,
		
		mensa,
		day
	}
) => {
	
	const containerAnimation = {
		hidden: {
			opacity: 0,
		},
		show: {
			opacity: 1,
			transition: {
				staggerChildren: .2,
				delayChildren: .1
			}
		}
	}
	const dayVariantAnimation = {
		hidden: {
			opacity: 0,
			y: 20
		},
		show: {
			opacity: 1,
			y: 0,
		}
	}

	const anim02 = {
		hidden: {
			opacity: 0,
			y: 20
		},
		show: {
			opacity: 1,
			y: 0,
		}
	}

	return (
		<div 
		// variants={anim02}
		>
			<Link href={`/mensa/${mensa}/${day}/${offer._id}`}>
					<div className={`my-4 p-5 flex gap-8 rounded-xl bg-background-container justify-between ${offer.soldOut ? "opacity-50" : ""}`}>
						{/* <p className="font-medium text-sm text-gray-400">{offer.titel}</p> */}
						<div className='flex-initial w-full'
						// variants={containerAnimation}
						// initial="hidden"
						// animate="show"
						>
							<p 
							// variants={dayVariantAnimation} 
							className="text-2xl font-bold">{offer.beschreibung}</p>
							<div className="mt-5 flex justify-between flex-wrap flex-row items-start gap-y-2">
								{
									offer.soldOut ? (
										<Pill>
											😔 Ausverkauft
										</Pill>
									) : (
										<>
											<div 
											// variants={dayVariantAnimation} 
											className="font-medium text-black text-sm flex gap-2 items-center">
												<Pill>{offer.preise.preis_s} €</Pill>
												<span className='text-gray-400 min-w-max'>{offer.preise.preis_g} €</span>
											</div>
											<div 
											// variants={dayVariantAnimation} 
											className='flex gap-2 justify-end'>
												{offer.qualityRating && <Pill>
													<svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M9.55706 0.846068C9.74421 0.488621 10.2558 0.488621 10.443 0.846068L12.8792 5.49937C12.9497 5.6339 13.0774 5.72913 13.2265 5.75821L18.2594 6.73997C18.6417 6.81455 18.7957 7.27832 18.5339 7.56676L14.9933 11.4678C14.8954 11.5757 14.8494 11.721 14.8674 11.8656L15.5279 17.1685C15.5772 17.5637 15.1672 17.855 14.8102 17.6785L10.2216 15.4096C10.082 15.3405 9.91808 15.3405 9.7784 15.4096L5.18989 17.6785C4.8329 17.855 4.42287 17.5637 4.4721 17.1685L5.13267 11.8656C5.15068 11.721 5.1047 11.5757 5.00675 11.4678L1.46612 7.56676C1.20433 7.27832 1.35831 6.81455 1.74063 6.73997L6.77357 5.75821C6.92262 5.72913 7.05037 5.6339 7.12081 5.49937L9.55706 0.846068Z" fill="#161616"/>
													</svg>
													</Pill>}
													{offer.labels.filter !== "all" && <Pill>{offer.labels.filter}</Pill>}
											</div>
										</>
									)
								}
							</div>
						</div>
						<div className='border-l pl-6 border-dashed border-main-black/80 flex items-center'>
							<svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M1 1.5L7 8L1 14.5" stroke="#161616" strokeWidth="2"/>
							</svg>
						</div>
					</div>
			</Link>
		</div>
	)
}