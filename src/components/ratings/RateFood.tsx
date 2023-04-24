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
		<div className="bg-light-green flex gap-6 flex-col justify-between text-center lg:max-w-lg  mx-auto w-full">
			{/* Second Row in Flexbox */}
			<div className="px-4 font-sans-reg w-full space-y-2">
				<div className={`text-4xl flex flex-start flex-col w-14 space-y-1`} style={{transform: `translate(${offsetX}px)`}}>
						<p className="block">
						<motion.div animate={controls}>
							{
								ratingPercentage < 0.25 ? emojis[0] :
								ratingPercentage < 0.5 ? emojis[1] :
								ratingPercentage < 0.75 ? emojis[2] :
								emojis[3]
							}
						</motion.div></p>
						<div className="inline-flex flex-row space-x-1 px-3 py-1 rounded-full font-sans-reg text-sm bg-white whitespace-nowrap justify-center"> 
							<p>{ratingPercentageTwoDigs}</p><p>/ 5</p>
						</div> 
				</div>
				<div className='bg-white w-full h-14 rounded-full items-center flex relative px-1' ref={handleBar}>
					<div className='w-0.5 h-1/2 rounded-full bg-black/20 absolute left-1/4'></div>
					<div className='w-0.5 h-1/2 rounded-full bg-black/20 absolute left-1/2'></div>
					<div className='w-0.5 h-1/2 rounded-full bg-black/20 absolute left-3/4'></div>
					<Draggable
						axis="x"
						defaultPosition={{x: 0, y: 0}}
						position={null}
						bounds="parent"
						scale={1}
						onDrag={handleDrag}>
						<div className='h-12 w-12'>
							<motion.div className='bg-main-green rounded-full h-full w-full' animate={{scale: isVibrating ? 1.1 : 1}}>
							</motion.div>
						</div>
					</Draggable>
				</div>
				{ 
				<div className="w-full flex justify-between text-xs text-gray/50 px-6">
				<p>1</p><p>3</p><p>5</p>
				</div>
				
				 }			
				<div className="text-sm inline-flex justify-center pt-2 space-x-2 items-center opacity-50">
					<img src="../.././icons/right-arrw.svg" className="w-4 rotate-180"></img>
					<p>Beweg den Kreis</p>
					<img src="../.././icons/right-arrw.svg" className="w-4"></img>
				</div>
			</div>


			{/* Bottom Row in Flexbox */}
			<div className="px-4 mb-6 flex flex-col gap-2">
				<button 
				onClick={() => {
					saveRating()
					setModalOpen(false);
				}}
				className={`bg-main-green font-semibold h-14 w-full min-w-max grow rounded-lg flex justify-center items-center gap-2 cursor-pointer px-4`}>
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
			<div className=" pt-6 inline-flex justify-center items-center text-xl cursor-pointer px-8">
				<h2 className="font-sans-bold">
					Bewerten
				</h2>
				<div className="ml-auto"></div>
			</div>
			<div className="px-12 my-4 py-4 border-y border-black/20">
				<p className="font-serif-reg text-base">
					{foodTitle}
				</p>
			</div>
		</div>
	)
}