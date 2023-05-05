import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { getSessionId } from '../../lib/localStorageHelper';
import { usePlausible } from 'next-plausible';

export default function RateFood(
	{
		setModalOpen,
		setCurrentModalContent,

		foodTitle,
		foodId,

		updateUserRating
	} : {
		setModalOpen: (open: boolean) => void,
		setCurrentModalContent: (content: string) => void,

		foodTitle: string,
		foodId: number,

		updateUserRating: (rating: number) => void
	}
) {

	const emojis = [
		"🤮",
		"😕",
		"😊",
		"😋"
	]

	const timing = 150
	const [isVibrating, setIsVibrating] = useState(false);
	useEffect(() => {
		// We only want to act when we're going from
		// not-booped to booped.
		if (!isVibrating) {
			return;
		}
		const timeoutId = window.setTimeout(() => {
			setIsVibrating(false);
		}, timing);
		// Just in case our component happens to
		// unmount while we're booped, cancel
		// the timeout to avoid a memory leak.

		console.log("Vibrating");
		if ("vibrate" in navigator) {
			// vibration API supported
			navigator.vibrate(100);
		}

		return () => {
			window.clearTimeout(timeoutId);
		};
		// Trigger this effect whenever `isBooped`
		// changes. We also listen for `timing` changes,
		// in case the length of the boop delay is
		// variable.
	}, [isVibrating, timing]);

	const handleBar = useRef(null)

	const [offsetX, setOffsetX] = useState(0);
	const [ratingPercentage, setRatingPercentage] = useState(0);
	const [ratingPercentageTwoDigs, calcRatingPercentageTwoDigs] = useState("0");


	const handleDrag = (e, data) => {
		setOffsetX(data.x);
		setRatingPercentage(data.x / (handleBar.current.offsetWidth - data.node.clientWidth - 8))

		var i = ((Math.round((ratingPercentage/25*100)*10)/10)+1).toString();
		i = i.replace(".", ",");
		calcRatingPercentageTwoDigs(i);
	}
	const controls = useAnimation()

	useEffect(() => {
		if(ratingPercentage > 0.24 && ratingPercentage < 0.26
			|| ratingPercentage > 0.49 && ratingPercentage < 0.51
			|| ratingPercentage > 0.74 && ratingPercentage < 0.76) {
			setIsVibrating(true);
			controls.start({
				scale: [0, 1],
				transition: {
					duration: 0.2,
				}
			})
		}
	}, [ratingPercentage])

	const sessionId = useRef(getSessionId())

	const saveRating = async () => {
		// Round to 2 decimals
		const rating = Math.round(ratingPercentage * 100) / 100;
		
		updateUserRating(rating);

		fetch(`${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://mensa-radar.de"}/api/qualityReview`, {
			method: "POST",
			body: JSON.stringify({
				offerId: foodId,
				sessionId: sessionId.current,
				rating: rating,
			})
		}).then(res => {
			console.log(res);
			const plausible = usePlausible()
			plausible('Rating')
		}).catch(err => {
			console.error(err);
		})
	}

	return (
		<div className="bg-green mx-auto flex w-full flex-col justify-between gap-6  text-center lg:max-w-lg">
			{/* Second Row in Flexbox */}
			<div className="w-full space-y-2 px-4 font-sans-reg">
				<div className={`flex-start flex w-14 flex-col space-y-1 text-4xl`} style={{transform: `translate(${offsetX}px)`}}>
					<p className="block">
						<motion.div animate={controls}>
							{
								ratingPercentage < 0.25 ? emojis[0] :
									ratingPercentage < 0.5 ? emojis[1] :
										ratingPercentage < 0.75 ? emojis[2] :
											emojis[3]
							}
						</motion.div></p>
					<div className="inline-flex flex-row justify-center space-x-1 whitespace-nowrap rounded-full bg-white px-3 py-1 font-sans-reg text-sm"> 
						<p>{ratingPercentageTwoDigs}</p><p>/ 5</p>
					</div> 
				</div>
				<div className='relative flex h-14 w-full items-center rounded-full bg-white px-1' ref={handleBar}>
					<div className='absolute left-1/4 h-1/2 w-0.5 rounded-full bg-black/20'></div>
					<div className='absolute left-1/2 h-1/2 w-0.5 rounded-full bg-black/20'></div>
					<div className='absolute left-3/4 h-1/2 w-0.5 rounded-full bg-black/20'></div>
					<Draggable
						axis="x"
						defaultPosition={{x: 0, y: 0}}
						position={null}
						bounds="parent"
						scale={1}
						onDrag={handleDrag}>
						<div className='h-12 w-12'>
							<motion.div className='h-full w-full rounded-full bg-main-green' animate={{scale: isVibrating ? 1.1 : 1}}>
							</motion.div>
						</div>
					</Draggable>
				</div>
				{ 
					<div className="flex w-full justify-between px-6 text-xs text-gray/50">
						<p>1</p><p>3</p><p>5</p>
					</div>
				
				 }			
				<div className="inline-flex items-center justify-center space-x-2 pt-2 text-sm opacity-50">
					<img src="../.././icons/right-arrw.svg" className="w-4 rotate-180"></img>
					<p>Beweg den Kreis</p>
					<img src="../.././icons/right-arrw.svg" className="w-4"></img>
				</div>
			</div>


			{/* Bottom Row in Flexbox */}
			<div className="mb-6 flex flex-col gap-2 px-4">
				<button 
					onClick={() => {
						saveRating()
						setModalOpen(false);
					}}
					className={`flex h-14 w-full min-w-max grow cursor-pointer items-center justify-center gap-2 rounded-lg bg-main-green px-4 font-semibold`}>
					<img src="../.././icons/check.png" className="w-4"></img>
					<p>
						Bewertung speichern 
					</p>
				</button>
			</div>
		</div>
	)
}

export const RateFoodHeader = ({foodTitle}: {foodTitle: string}) => {

	return (
		<div>
			<div className=" inline-flex cursor-pointer items-center justify-center px-8 pt-6 text-xl">
				<h2 className="font-sans-bold">
					Bewerten
				</h2>
				<div className="ml-auto"></div>
			</div>
			<div className="my-4 border-y border-black/20 px-12 py-4">
				<p className="font-serif-reg text-base">
					{foodTitle}
				</p>
			</div>
		</div>
	)
}