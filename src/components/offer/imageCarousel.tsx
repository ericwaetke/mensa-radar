import Image from "next/image"

export const ImageCarousel = (
	{ offer, tempImage, localAiThumbnail, aiThumbnailUrl, openImageFlow }: 
	{ offer: FoodOffering, tempImage: string, localAiThumbnail: string, aiThumbnailUrl: string, openImageFlow: () => void}) => {
	return (
		<div className="w-full rounded-t-xl border-b border-gray/20 bg-lightshiny-green p-4">
			<div className="h-min-20 m-auto  w-full max-w-xs rounded-lg xs:max-w-sm">
				{offer.imageUrls.length > 0 || tempImage != "" ?
					<>
						<div onClick={() => openImageFlow()} className="relative m-auto h-52 w-4/6 cursor-pointer ">
							{
								tempImage !== "" ?
									<img src={tempImage} className="h-full rounded-lg object-cover" />
									:
									<Image src={offer.imageUrls[offer.imageUrls.length - 1]} className="h-full w-full rounded-lg object-cover" layout="fill" />
							}
							<span className="absolute left-2 top-2 flex space-x-1  rounded-full bg-white/60 px-2 py-1 font-sans-med text-xs text-black backdrop-blur">
								<span>Nutzer:innen-Foto</span>
							</span>
							<span className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center space-x-1 rounded-full bg-white font-sans-med text-white backdrop-blur">
								<img alt="Eigenes Foto" src="/icons/camera.svg" className="w-6"></img>
							</span>
						</div>
					</>
					: offer.has_ai_thumbnail || (localAiThumbnail && localAiThumbnail !== "") ? <>

						{
							offer.has_ai_thumbnail
								? <div onClick={() => openImageFlow()} className="relative m-auto h-48 w-full cursor-pointer ">
									<Image className="h-full w-full rounded-lg object-cover" src={aiThumbnailUrl} layout="fill" key={offer.id} />

									<span className="absolute left-2 top-2 flex space-x-1  rounded-full bg-white/60 px-2 py-1 font-sans-med text-xs text-black backdrop-blur">
										<svg role="img" xmlns="http://www.w3.org/2000/svg" className="h-full" width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" aria-labelledby="boltIconTitle" stroke="currentColor" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#000"> <title id="boltIconTitle">Bolt</title> <path d="M5 14l8-11v7h5l-8 11v-7z" /> </svg>

										<span>AI-generiert</span>
									</span>
									<span className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center space-x-1 rounded-full bg-white font-sans-med text-white backdrop-blur">
										<img alt="Eigenes Foto aufnehmen" src="/icons/camera.svg" className="w-6"></img>
									</span>
								</div>
								:

								<div onClick={() => openImageFlow()} className="relative m-auto h-48 w-full cursor-pointer ">
									<img src={`data:image/png;base64,${localAiThumbnail}`} onClick={() => openImageFlow()} className="relative h-full w-full rounded-lg object-cover" />
									<span className="absolute left-2 top-2 flex space-x-1  rounded-full bg-white/60 px-2 py-1 font-sans-med text-xs text-black backdrop-blur">
										<svg role="img" xmlns="http://www.w3.org/2000/svg" className="h-full" width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" aria-labelledby="boltIconTitle" stroke="currentColor" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#000"> <title id="boltIconTitle">Bolt</title> <path d="M5 14l8-11v7h5l-8 11v-7z" /> </svg>

										<span>AI-generiert</span>
									</span>
									<span className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center space-x-1 rounded-full bg-white font-sans-med text-white backdrop-blur">
										<img alt="Eigenes Foto aufnehmen" src="/icons/camera.svg" className="w-6"></img>
									</span>
								</div>
						}
					</> :
						<div className={`flex h-full max-w-full animate-pulse items-center justify-center rounded-lg bg-gray/20 ${offer.sold_out ? "hidden" : ""}`}>
							<span className="m-2 flex h-12 flex-row items-center justify-center gap-2 rounded-full bg-white px-4 opacity-100">
								<img alt="Eigenes Foto aufnehmen" src="/icons/camera.svg" className="w-6"></img>
								Foto aufnehmen
							</span>
						</div>
				}
			</div>
		</div>
	)
}