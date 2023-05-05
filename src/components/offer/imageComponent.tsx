import Image from "next/image"

export const ImageComponent = (
	{type, src}:
	{type: "user" | "ai", src: string}
	) => {

	return <div className="relative m-auto h-52 min-w-52 w-52 cursor-pointer snap-center shrink-0">
		<Image src={src} className="h-full w-full rounded-lg object-cover" layout="fill" />
		<span className="absolute left-2 top-2 flex space-x-1  rounded-full bg-white/60 px-2 py-1 font-sans-med text-xs text-black backdrop-blur">
			{
				type === "ai" ? <>
					<svg role="img" xmlns="http://www.w3.org/2000/svg" className="h-full" width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" aria-labelledby="boltIconTitle" stroke="currentColor" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#000"> <title id="boltIconTitle">Bolt</title> <path d="M5 14l8-11v7h5l-8 11v-7z" /> </svg>
					<span>AI-generiert</span>
				</> : <span>Nutzer:innen-Foto</span>
			}
		</span>
		<span className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center space-x-1 rounded-full bg-white font-sans-med text-white backdrop-blur">
			<img alt="Eigenes Foto" src="/icons/camera.svg" className="w-6"></img>
		</span>
	</div>
}