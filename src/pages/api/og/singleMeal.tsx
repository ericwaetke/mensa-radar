import { ImageResponse } from "@vercel/og";
import { env } from "../../../env.mjs";
import { supabase } from '../../../lib/getSupabaseClient';

export const config = {
	runtime: 'experimental-edge'
}

const ibmblex_bold = fetch(new URL('../../../assets/fonts/ibm-plex-serif-700.ttf', import.meta.url)).then(
	(res) => res.arrayBuffer(),
);
const ibmblex_regular = fetch(new URL('../../../assets/fonts/ibm-plex-serif-500.ttf', import.meta.url)).then(
	(res) => res.arrayBuffer(),
);

export default async function handler(req) {
	const { searchParams } = new URL(req.url)
	const id = searchParams.get('id') ?? "Default Title"

	const { data: offer }: { data: FoodOffering } = await supabase
		.from("food_offerings")
		.select('food_title')
		.eq('id', id)
		.single()

	// Get Food Data and Image by ID
	const { data: images } = await supabase
		.from("food_images")
		.select('image_name')
		.eq('food_id', id)

	let imageUrl: string;
	let userImage: bool = false;
	if (images && images.length > 0) {
		images!.map(async image => {
			const { data, error } = await supabase
				.storage
				.from('food-images')
				.list('', {
					limit: 100,
					offset: 0,
					sortBy: { column: 'name', order: 'asc' },
					search: image.image_name
				})
		})

		const generateUrls = (imageName: string) => {
			return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/food-images/${imageName}?token=${env.NEXT_PUBLIC_SUPABASE_KEY}`
		}

		imageUrl = generateUrls(images![images.length - 1].image_name)
		userImage = true
	} else {
		imageUrl = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ai-thumbnails/thumbnail_${id}.png?token=${env.NEXT_PUBLIC_SUPABASE_KEY}`
	}

	const fontData = await ibmblex_bold
	const fontDataRegular = await ibmblex_regular

	return new ImageResponse(
		(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#fff',
					fontSize: 64,
					lineHeight: 1,
					fontWeight: 600,
					position: 'relative',
				}}
			>
				<img src={imageUrl} style={{ 
					width: "400px", 
					height: "100%", 
					objectFit: "cover" ,
					filter: userImage ? "saturate(1.25) contrast(1.25)" : "none",
				}} />
				
			
				<div style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					gap: "32px",
					width: "800px",
					height: "100%",
					color: "#000",
					background: '#88E2A1',
					padding: "88px 16px 88px 64px"
				}}>
					<p style={{
						fontSize: "35px",
						margin: "0px",
					}}>Heute in deiner Mensa</p>
					<p style={{
						fontFamily: "ibm-regular",
						fontSize: "50px",
						margin: "0",
					}}>
						{offer.food_title}
					</p>
				</div>
				<svg xmlns="http://www.w3.org/2000/svg" width="201" height="204" fill="none" style={{
					position: "absolute",
					top: 493,
					left: 964 - 100,
					zIndex: 900,
				}}>
					<path fill="#C5FFD4" fill-rule="evenodd" d="M173.495 47.613 47.814 28.063 30.079 143.818l.053.008-.05.364c-3.316 21.321 22.023 40.601 56.725 45.999 34.641 5.389 65.414-7.464 68.822-28.718l.032.005 17.834-113.863Z" clip-rule="evenodd"/>
					<path fill="#000" fill-rule="evenodd" d="M30 144.772c-2.771 21.089 22.421 40.068 56.807 45.417 34.641 5.389 65.414-7.464 68.822-28.718l.032.005 17.834-113.863-125.681-19.55-17.735 115.755.053.008c0-.001 0 0 0 0a15.839 15.839 0 0 0-.05.364l-.02.137c-.023.148-.044.297-.063.445Zm11.514-5.299-.846 5.871c-.01.065-.018.131-.027.197l-.018.142-.022.143c-.856 5.502 1.67 12.208 10.213 19.004 8.483 6.748 21.636 12.353 37.63 14.841 15.699 2.442 30.024.651 40.386-3.674 10.552-4.404 15.386-10.586 16.288-16.211l1.436-8.954 14.776-94.338L56.72 40.22l-15.206 99.252Z" clip-rule="evenodd"/>
					<path fill="#C5FFD4" d="M173.497 47.61c-2.015 12.958-31.784 19.085-66.49 13.686C72.301 55.898 45.8 41.018 47.815 28.061 49.831 15.104 79.6 8.977 114.306 14.375c34.706 5.399 61.207 20.279 59.191 33.236Z"/>
					<path fill="#000" fill-rule="evenodd" d="M163.108 45.551c.002 0-.006.02-.031.057a.197.197 0 0 1 .031-.057Zm-.32.394c-.162-.313-.459-.786-.996-1.431-1.616-1.945-4.623-4.43-9.332-7.074-9.342-5.246-23.36-9.99-39.79-12.547-16.43-2.555-31.227-2.292-41.722-.132-5.29 1.088-8.91 2.542-11.04 3.904-.707.452-1.134.813-1.383 1.062.162.313.46.785.995 1.43 1.617 1.946 4.624 4.43 9.332 7.074 9.343 5.246 23.361 9.991 39.791 12.547 16.43 2.556 31.227 2.293 41.722.133 5.289-1.089 8.909-2.543 11.04-3.905.707-.452 1.133-.812 1.383-1.061ZM58.339 29.255c.002 0 .008.02.013.063-.012-.043-.015-.064-.013-.064Zm-.134.865a.191.191 0 0 1 .03-.056.198.198 0 0 1-.03.056ZM162.96 46.354c.012.043.014.063.012.063a.28.28 0 0 1-.012-.063Zm-55.954 14.942c34.706 5.399 64.475-.728 66.49-13.685 2.016-12.957-24.485-27.837-59.191-33.236-34.706-5.398-64.475.729-66.49 13.686C45.8 41.018 72.3 55.898 107.007 61.296Z" clip-rule="evenodd"/>
					<path fill="#000" fill-rule="evenodd" d="M61.856 56.155 33.502 42.532a1.563 1.563 0 0 1 1.144-2.9l16.21 5.07 3.177-10.16-16.21-5.07a12.208 12.208 0 0 0-14.834 6.774c-2.624 6.02-.016 13.037 5.903 15.88L57.246 65.75l4.61-9.595ZM150.726 69.826l31.355-2.509a1.563 1.563 0 0 0-.023-3.117l-16.948-1.103.691-10.622 16.948 1.102a12.207 12.207 0 0 1 11.404 11.657c.282 6.561-4.676 12.17-11.223 12.694l-31.355 2.509-.849-10.611Z" clip-rule="evenodd"/>
				</svg>
			</div>
		),
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: 'ibm-bold',
					data: fontData,
				},
				{
					name: 'ibm-regular',
					data: fontDataRegular,
				},
			]
		}
	)
}
