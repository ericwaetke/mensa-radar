import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { ChangeEvent, useEffect, useRef, useState } from "react"

const CaptureImageButton = ({
	label,
	handleUpload
}: {
	label: string, 
	handleUpload: (e) => void
}) => {
	return (
		<>
			<label htmlFor="file_input" className="h-14 w-full min-w-max grow border-2 rounded-lg flex justify-center items-center gap-2 cursor-pointer px-4">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
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
						handleUpload(e); // 👈 this will trigger when user selects the file.
					}}
				/>
		</>
	)
}

export const CaptureImage = (
	{
		setModalOpen,
		setTempImage,

		foodTitle,
		foodId,
	} : {
		setModalOpen: (open: boolean) => void,
		setTempImage: (image: string) => void,

		foodTitle: string,
		foodId: number,
	}
) => {
	
	const [fileName, setFileName] = useState("")
	const [modalTempImage, setModalTempImage] = useState("")
	const [uploading, setUploading] = useState(false)

	const [currentStep, setCurrentStep] = useState("preparation")
	const [errorCode, setErrorCode] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const [retryCount, setRetryCount] = useState(0)

	const [supabaseUrl, setSupabaseUrl] = useState(process.env.NEXT_PUBLIC_SUPABASE_URL);
	const [supabaseKey, setSupabaseKey] = useState(process.env.NEXT_PUBLIC_SUPABASE_KEY);
	// const supabase = useRef(createClient(supabaseUrl, supabaseKey)).current

	const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		let file: File;
	
		if (e.target.files) {
		  file = e.target.files[0];
		}

		setModalTempImage(URL.createObjectURL(file))
		setTempImage(URL.createObjectURL(file))
		setUploading(true)

		uploadFileToSupabase(file, fileName).then(res => {
			const {data, error} = res
			if (data) {
				setCurrentStep("preview")
	
				const params = new URLSearchParams({
					f: data.path,
					b: "food-images",
				})
				// check if image contains food
				fetch(`/api/labelImage?${params.toString()}`)
					.then(res => res.json())
					.then(data => {
						if(data) {
							if (data.isFood){
								setUploading(false)
							} else if(!data.isFood) {
								console.log("not food")
								setUploading(false)
								setErrorCode("no_food")
								setCurrentStep("error")
							}
						}
					})
					.catch(err => console.log(err))
			} else if (error) {
				setErrorCode("upload")
				setErrorMessage(error.message)
				setCurrentStep("error")
				setUploading(false)
				console.log(error);

				// Generate a new random name for the file with 12 characters
				setFileName(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))

			}
		}).catch(err => {

			setErrorCode("upload")
			setErrorMessage(err.message)
			setCurrentStep("error")
			setUploading(false)
			console.log(err);

			// Generate a new random name for the file with 12 characters
			setFileName(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))

		})
	};

	const uploadFileToSupabase = (file: File, fileName: string) => {
		console.log(file, fileName)
		const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY)

		return supabase.storage
			.from("food-images")
			.upload(fileName, file)
	}

	

	const attachImageToFood = async () => {
		const supabase = createClient(supabaseUrl, supabaseKey)

		const { data: imageData, error: imageError } = await supabase
			.from('food_images')
			.insert({
				food_id: foodId,
				image_name: fileName
			})

			
			if (imageData) {
				console.log(imageData)
			} else if (imageError) {
				console.log(imageError)
				setUploading(false)
			}
	}

	useEffect(() => {
		console.log("captureImage mounted")
		setFileName(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
	}, [])

	return (
		<div className="bg-background-container h-screen flex flex-col justify-between text-center">
			
			{/* First Row in Flexbox */}
			<div>
				<div onClick={() => setModalOpen(false)}>
					<p>&lt;-</p>
					<h2>
						Foto Aufnehmen
					</h2>
				</div>
				<p>
					{foodTitle}
				</p>
			</div>

			{/* Second Row in Flexbox */}
			<div>
				{
					currentStep === "preparation" ? <>
						<h2>
							Danke, dass du ein Foto schießt!
						</h2>
						<p>
							🙋
						</p>
						<p>
							Bitte halte dich an unsere Nettique-Regeln und fotografiere nur das Essen.
							Dein Foto wird von Google analysiert.
						</p>
						<p>
							✨
						</p>
						<p>
							Dein Foto muss nicht wunderschön sein,
							das Essen muss aber erkennbar sein.
							Wir zeigen dir im Anschluss eine Vorschau.
						</p>
					</> : currentStep === "preview" ? <>
						<h2>
							Bist du mit dem Foto zufrieden?
						</h2>
						{modalTempImage !== "" ? <img src={modalTempImage} className="w-full" /> : null}
					</> : currentStep === "error" ? <>
						<h2>
							{
								errorCode === "no_food" ? "Laut unserer Bilderkennung zeigt dein Foto kein Essen." : errorMessage
							}
						</h2>
					</> : null
				}
			</div>


			{/* Bottom Row in Flexbox */}
			<div>
				{
					currentStep === "preparation" ? <>
						<CaptureImageButton label="Foto aufnehmen" handleUpload={handleUpload} />
					</> : currentStep === "preview" ? <>
							{
								uploading ? <></> : <>

								</>
							}
					</> : currentStep === "error" ? <>
						<CaptureImageButton label="Nochmal versuchen" handleUpload={handleUpload} />

					</> : null
				}
			</div>
		</div>
	)
}