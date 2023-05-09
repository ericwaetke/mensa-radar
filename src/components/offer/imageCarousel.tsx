import Image from "next/image"
import { useState } from "react"
import { ImageComponent } from "./imageComponent"

export const ImageCarousel = (
  { offer, tempImage, localAiThumbnail, aiThumbnailUrl, openImageFlow }:
    { offer: FoodOffering, tempImage: string, localAiThumbnail: string, aiThumbnailUrl: string, openImageFlow: () => void }) => {

  const [imageAmount, setImageAmount] = useState<number>(
    //ai images
    (offer.has_ai_thumbnail || localAiThumbnail ? 1 : 0) +
    // user images
    (offer.imageUrls.length + (tempImage ? 1 : 0))
  )

  return (
    <div className="w-full rounded-t-xl border-b border-gray/20 bg-lightshiny-green p-4">
      <div className="h-min-20 m-auto rounded-lg">
        <div onClick={() => openImageFlow()} className={`relative ${imageAmount > 1 ? "overflow-x-auto" : "overflow-hidden"} flex gap-8 snap-x px-[25%] snap-mandatory rounded-lg`}>

          {
            tempImage ? <ImageComponent type="user" src={tempImage} /> : null
          }
          {
            offer.imageUrls.map((url, index) => {
              return <ImageComponent type="user" src={url} key={index} />
            })
          }
          {
            offer.has_ai_thumbnail ? <ImageComponent type="ai" src={aiThumbnailUrl} /> : null
          }
          {
            localAiThumbnail && localAiThumbnail !== "" && !offer.has_ai_thumbnail ? <ImageComponent type="ai" src={`data:image/png;base64,${localAiThumbnail}`} /> : null
          }

          {
            imageAmount === 0 ? <>
              <div className="h-24 w-full border-2 rounded-xl border-dashed border-black/20 relative">
                <span className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center space-x-1 rounded-full bg-white font-sans-med text-white">
                  <img alt="Eigenes Foto" src="/icons/camera.svg" className="w-6"></img>
                </span>
              </div>
            </> : null
          }

        </div>
      </div>
    </div>
  )
}
