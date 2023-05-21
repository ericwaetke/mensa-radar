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
				}}
			>
				<img src={imageUrl} style={{ width: "400px", height: "100%", objectFit: "cover" }} />

			
				<div style={{
					display: "flex",
					flexDirection: "column",
					gap: "32px",
					width: "800px",
					height: "100%",
					color: "#000",
					background: '#88E2A1',
					padding: "88px 64px"
				}}>
					<p style={{
						fontSize: "35px",
						margin: 0,
					}}>Heute in deiner Mensa</p>
					<p style={{
						fontFamily: "ibm-regular",
						fontSize: "50px",
						margin: "32px 0 0 0",
					}}>
						{offer.food_title}
					</p>
				</div>
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
