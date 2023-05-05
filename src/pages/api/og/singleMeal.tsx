import { ImageResponse } from "@vercel/og";
import { env } from "../../../env.mjs";
import { supabase } from '../../../lib/getSupabaseClient';

export const config = {
	runtime: 'experimental-edge'
}

const font = fetch(new URL('../../../assets/NotoSans-Bold.ttf', import.meta.url)).then(
	(res) => res.arrayBuffer(),
);

export default async function handler(req) {
	const { searchParams } = new URL(req.url)
	const id = searchParams.get('id') ?? "Default Title"
	console.log(id)

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
	if (images) {
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

	const fontData = await font

	return new ImageResponse(
		(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#fff',
					fontSize: 64,
					lineHeight: 1,
					fontWeight: 600,
				}}
			>
				<img width="1920" height="2560" src={imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

				{/* Black Gradient from Bottom to Middle */}
				<div style={{
					position: "absolute",
					bottom: 0,
					width: "100%",
					height: "75%",
					background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.60) 100%)"

				}}
				></div>
				<div style={{
					bottom: 48,
					left: 48,
					width: "75%",
					color: "#fff",
					position: "absolute"
				}}>{
						offer.food_title
					}</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: 'Noto',
					data: fontData,
				},
			]
		}
	)
}
