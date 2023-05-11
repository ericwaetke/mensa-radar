import Image from "next/image"

export const ImageComponent = (
	{ type, src }:
    { type: "user" | "ai", src: string }
) => {

	return <div className={`relative m-auto h-52 ${type === "user" ? "w-40" : "w-full"} shrink-0 cursor-pointer snap-center snap-always object-cover`}>
		<Image src={src} className={`h-full w-full rounded-lg object-cover ${type === "user" ? "contrast-125 saturate-150" : ""}`} layout="fill" alt={`${type} Bild vom Essen`}/>
		<span className="absolute left-2 top-2 z-10 flex space-x-1 rounded-full bg-white/60 px-2 py-1 font-sans-med text-xs text-black
    after:absolute after:left-0 after:top-0 after:h-full after:w-full after:rounded-full after:backdrop-blur after:content-['']">
			{
				type === "ai" ? <>
					<svg className="z-20 h-full" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" aria-labelledby="boltIconTitle" stroke="currentColor" strokeLinecap="square" strokeLinejoin="miter" fill="none" color="#000"> <title id="boltIconTitle">Bolt</title> <path d="M5 14l8-11v7h5l-8 11v-7z" /> </svg>
					<span className="z-20">AI-generiert</span>
				</> : <span className="z-20">Nutzer:innen-Foto</span>
			}
		</span>
	</div>
}
