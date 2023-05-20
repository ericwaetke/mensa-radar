import Image from "next/image"
import { useEffect, useState } from "react"
import { ImageComponent } from "./imageComponent"

export const ImageCarousel = (
	{ offer, tempImage, localAiThumbnail, aiThumbnailUrl, openImageFlow, soldOut }:
		{ offer: FoodOffering, tempImage: string, localAiThumbnail: string, aiThumbnailUrl: string, openImageFlow: () => void, soldOut: boolean }) => {

	const [imageAmount, setImageAmount] = useState<number>(
		//ai images
		(offer.has_ai_thumbnail || localAiThumbnail ? 1 : 0) +
		// user images
		(offer.imageUrls.length + (tempImage ? 1 : 0))
	)
	useEffect(() => {
		setImageAmount(
			//ai images
			(offer.has_ai_thumbnail || localAiThumbnail ? 1 : 0) +
			// user images
			(offer.imageUrls.length + (tempImage ? 1 : 0))
		)
	}, [localAiThumbnail])

	return (
		<div className={`w-full rounded-t-xl  overflow-hidden border-b border-gray/20 bg-lightshiny-green ${imageAmount > 1 ? "p-4" : ""} ${soldOut ? "opacity-50" : ""}`}>
			<div className="relative m-auto min-h-max">
				<div onClick={() => !soldOut ? openImageFlow() : null} className={`no-scrollbar relative ${imageAmount > 1 ? "overflow-x-auto" : "overflow-hidden"} flex snap-x snap-mandatory gap-8 ${imageAmount !== 1 ? "px-[25%] rounded-lg" : ""}`}>

					{
						tempImage ? <ImageComponent single={imageAmount === 1} type="user" src={tempImage} /> : null
					}
					{
						offer.imageUrls.map((url, index) => {
							return <ImageComponent single={imageAmount === 1} type="user" src={url} key={index} />
						})
					}
					{
						offer.has_ai_thumbnail ? <ImageComponent single={imageAmount === 1} type="ai" src={aiThumbnailUrl} /> : null
					}
					{
						localAiThumbnail && localAiThumbnail !== "" && !offer.has_ai_thumbnail ? <ImageComponent single={imageAmount === 1} type="ai" src={`data:image/png;base64,${localAiThumbnail}`} /> : null
					}

					{
						imageAmount === 0 ? <>
							<div className="relative h-52 w-full rounded-xl border-2 border-dashed border-black/20">
							</div>
						</> : null
					}


				</div>
				<span className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center space-x-1 rounded-full bg-white font-sans-med text-white">
					<Image alt="Eigenes Foto" src="/icons/camera.svg" height={24} width={24} className="w-6"></Image>
				</span>
			</div>
		</div>
	)
}
