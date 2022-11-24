export default function RateFood(
	{
		setModalOpen,
		setCurrentModalContent,

		foodTitle,
		foodId,
	} : {
		setModalOpen: (open: boolean) => void,
		setCurrentModalContent: (content: string) => void,

		foodTitle: string,
		foodId: number,
	}
) {

	return (
		<div className="bg-light-green h-screen flex flex-col justify-between text-center sm:max-w-md">
			
			{/* First Row in Flexbox */}
			<div>
				<div 
					className="flex pt-6 justify-center items-center text-xl cursor-pointer px-8"
					onClick={() => setModalOpen(false)}>

					<img src="/icons/right-arrw.svg" className="rotate-180 mr-auto w-4" />	

					<h2 className="font-sans-bold">
						Bewerten
					</h2>
					<div className="ml-auto"></div>
				</div>
				<div className="px-12 my-6 py-6 border-y border-black/20">
					<p className="font-serif-reg text-xl">
						{foodTitle}
					</p>
				</div>
			</div>

			{/* Second Row in Flexbox */}
			<div className="px-4 font-sans-reg">
				
			</div>


			{/* Bottom Row in Flexbox */}
			<div className="px-4 mb-6 flex flex-col gap-2">
				<button className="font-sans-med h-14 w-full min-w-max border border-black/20 grow rounded-lg flex justify-center items-center gap-2 cursor-pointer px-4">
					<img src="/icons/camera.svg" className="w-5" />	
					<p>
						{"Foto vom Essen aufnehmen"}
					</p>
					
				</button>

				<button 
				onClick={() => {}}
				className={`bg-main-green font-semibold h-14 w-full min-w-max grow rounded-lg flex justify-center items-center gap-2 cursor-pointer px-4`}>
					<p>
						Bewertung speichern
					</p>
				</button>
			</div>
		</div>
	)
}