import { createClient } from "@supabase/supabase-js"
import { usePlausible } from "next-plausible"
import { ChangeEvent, useEffect, useState } from "react"
import { env } from "../../env.mjs"
import type { OurFileRouter } from "../../server/uploadthing.js"
import { generateReactHelpers } from "@uploadthing/react/hooks";

const CaptureImageButton = ({
	label,
	handleUpload,
}: {
	label: string,
	handleUpload: (e) => void,
}) => (
	<>
		<label htmlFor="file_input" className="flex h-14 w-full min-w-max grow cursor-pointer items-center justify-center gap-2 rounded-lg bg-main-green px-4 font-sans-semi">
			<img src="/icons/camera.svg" className="w-5" />
			<p>
				{label}
			</p>
		</label>
		<input
			type="file"
			accept="image/*"
			className="hidden"
			id="file_input"
			onChange={(e) => {
				handleUpload(e) // 👈 this will trigger when user selects the file.
			}} />
	</>
)

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export const CaptureImage = (
	{
		setModalOpen,
		setTempImage,
		setCurrentModalContent,

		triggerAiThumbnailRegeneration,

		foodTitle,
		foodId,
	}: {
		setModalOpen: (open: boolean) => void,
		setTempImage: (image: string) => void,
		setCurrentModalContent: (content: string) => void,

		triggerAiThumbnailRegeneration: () => void

		foodTitle: string,
		foodId: number,
	}
) => {
	const plausible = usePlausible()

	const [imageUrl, setImageUrl] = useState("")
	const [modalTempImage, setModalTempImage] = useState("")
	const [imageValid, setImageValid] = useState(false)
	const [processing, setProcessing] = useState(false)
	const [queued, setQueued] = useState(false)

	const [currentStep, setCurrentStep] = useState("preparation")
	const [errorCode, setErrorCode] = useState<"no_food" | "upload_error">()
	const [errorMessage, setErrorMessage] = useState("")
	const [retryCount, setRetryCount] = useState(0)

	const {startUpload} = useUploadThing({
		endpoint: "userImage",
		onClientUploadComplete(res) {
			console.log(res)
		},
		onUploadError(e) {
			console.log(e)
		},
	})
	const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
		// Get the file from the input
		const file: File = e.target.files[0]

		// Setting the file as a temp image, so we can show it in the preview before the upload is finished
		const tempImage = URL.createObjectURL(file)
		setModalTempImage(tempImage)
		setTempImage(tempImage)
		setProcessing(true)
		setCurrentStep("preview")

		// Upload the file to uploadthing
		const fileUpload: Promise<{
			fileUrl: string;
			fileKey: string;
		}[]> = startUpload([file]);

		fileUpload.then((res) => {
			setImageUrl(res[0].fileUrl)

			fetch(`/api/ai/labelImage`, {
				method: "POST",
				body: JSON.stringify({
					imageUrl: res[0].fileUrl,
				}),
			})
				.then(res => res.json())
				.then(data => {
					if (data) {
						if (data.isFood) {
							setImageValid(true)
							setProcessing(false)
						} else if (!data.isFood) {
							setImageValid(false)
							console.log("not food")
							setProcessing(false)
							setErrorCode("no_food")
							setCurrentStep("error")
							setTempImage("")
							setQueued(false)
						}
					}
				})
				.catch(err => {
					console.log(err)
				})
		})
	}

	const saveImage = (nextStep: string = "close") => {
		if (!processing) {
			if (imageValid) {
				attachImageToFood()
				plausible("Upload Image")
				if (nextStep === "close") {
					setModalOpen(false)
				} else if (nextStep === "rating") {
					setCurrentModalContent("rating")
				}
			}
		} else {
			setQueued(true)
		}
	}

	const attachImageToFood = async () => {
		const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_KEY)

		const { data: imageData, error: imageError } = await supabase
			.from('food_images')
			.insert({
				food_id: foodId,
				image_url: imageUrl
			})

		if (imageData) {
		} else if (imageError) {
			console.error(imageError)
			setProcessing(false)
		}
	}

	useEffect(() => {
		if (queued) {
			saveImage()
		}
	}, [processing])

	return (
		<div className="mx-auto flex flex-col justify-between text-center sm:max-w-md">

			{/* Second Row in Flexbox */}
			<div className="p-7 pt-0 font-sans-reg">
				{
					currentStep === "preparation" ? <>
						<p className="my-4 text-5xl">
							🙋
						</p>
						<h2 className="pb-4 font-sans-semi text-xl">
							Danke, dass du ein Foto schießt!
						</h2>
						<p className="text-gray/70">
							Fotografiere nur dein Essen. Dein Foto wird im Anschluss automatisch durch Google analysiert.
						</p>
					</> : currentStep === "preview" ? <>
						<h2 className="font-sans-semi text-xl">
							Bist du mit dem Foto zufrieden?
						</h2>
						{/* Image Holder */}
						<div className="m-auto my-3 h-52 w-56 rounded-xl bg-black">
							{modalTempImage !== "" ? <img src={modalTempImage} className="h-full rounded-xl object-cover" /> : null}

						</div>

						<label htmlFor="file_input" className=" flex h-14 w-full min-w-max grow cursor-pointer items-center justify-center gap-2 rounded-lg border border-black/20 px-4 font-sans-med">
							<img src="/icons/camera.svg" className="w-5" />
							<p>
								{"Foto ersetzen"}
							</p>
						</label>
						<input
							type="file"
							accept="image/*"
							className="hidden"
							id="file_input"
							onChange={(e) => {
								handleUpload(e); // 👈 this will trigger when user selects the file.
							}}
						/>
					</> : currentStep === "error" ? <>
						<p className="my-4 text-5xl">
							😟
						</p>
						<p className="pb-2 font-sans-med text-black/70">
							Fehler
						</p>
						<h2 className="mx-auto w-10/12 font-sans-semi text-2xl">
							{
								errorCode === "no_food" ? "Laut unserer Bilderkennung zeigt dein Foto kein Essen." : errorMessage
							}
						</h2>
					</> : null
				}
			</div>


			{/* Bottom Row in Flexbox */}
			<div className="mb-6 flex flex-col gap-2 px-4">
				{
					currentStep === "preparation" ? <>
						<CaptureImageButton label="Foto aufnehmen" handleUpload={handleUpload} />
					</> : currentStep === "preview" ? <>

						<button
							onClick={() => saveImage("close")}
							className={`${queued ? "bg-black/20" : "bg-main-green"} flex h-14 w-full min-w-max grow cursor-pointer items-center justify-center gap-2 rounded-lg px-4 font-semibold`}>
							{
								!queued ? <>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path d="M5 12l5 5l10 -10" />
									</svg>
								</> : <>
									<svg className="mr-2 inline h-8 w-8 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="none" />
										<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#000" />
									</svg>
									<span className="sr-only">Loading...</span>
								</>
							}
							<p>
								{!queued ? "Foto speichern" : "Foto wird überprüft, einen Moment..."}
							</p>
						</button>

					</> : currentStep === "error" ? <>
						<p className="pb-2 font-sans-med text-gray/70">Wir werden das überprüfen.</p>
						<CaptureImageButton label="Neues Foto aufnehmen" handleUpload={handleUpload} />
					</> : null
				}
			</div>
		</div>
	)
}

export const CaptureImageHeader = ({ foodTitle }: { foodTitle: string }) => {
	return (
		<div>
			<div className=" inline-flex cursor-pointer items-center justify-center px-8 pt-6 text-xl">
				<h2 className="font-sans-bold">
					Foto aufnehmen
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
