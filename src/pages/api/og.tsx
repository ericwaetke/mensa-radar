import { ImageResponse } from "@vercel/og"

export const config = {
	runtime: "experimental-edge", // this is a pre-requisite
	regions: ["fra1"], // only execute this function on iad1
}

const font = fetch(
	new URL("../../assets/NotoSans-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer())

export default async function handler(req) {
	const { searchParams } = new URL(req.url)
	const title = searchParams.get("title") ?? "Default Title"

	const fontData = await font

	return new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					height: "100%",
					width: "100%",
					alignItems: "center",
					justifyContent: "space-between",
					flexDirection: "column",
					fontFamily: "Noto",
					backgroundImage:
						"linear-gradient(to bottom, #88E2A1, #4BCA6E)",
					padding: "1em 4em",
				}}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						width: "100%",
						height: "50px",
						color: "white",
						fontSize: 24,
						fontWeight: 700,
					}}>
					<svg
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 149 149"
						height="50">
						<g clip-path="url(#a)">
							<g
								filter="url(#b)"
								transform="rotate(-15 74.5001 74.4999)"
								stroke-opacity=".15"
								stroke-width="6">
								<circle
									cx="74.5001"
									cy="74.4999"
									r="63.4306"
									stroke="url(#c)"
								/>
								<circle
									cx="74.5001"
									cy="74.4999"
									r="43.644"
									stroke="url(#d)"
								/>
							</g>
							<mask id="e" fill="#fff">
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M113.17 30.4816 43.8263 48.6865l16.9075 63.8055.029-.008c.0182.067.0371.133.0564.2 3.0884 11.763 20.5234 16.019 39.6698 10.992 19.113-5.018 32.119-18.59 29.093-30.3393l.018-.0049-16.43-62.8502Z"
								/>
							</mask>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M113.17 30.4816 43.8263 48.6865l16.9075 63.8055.029-.008c.0182.067.0371.133.0564.2 3.0884 11.763 20.5234 16.019 39.6698 10.992 19.113-5.018 32.119-18.59 29.093-30.3393l.018-.0049-16.43-62.8502Z"
								fill="#fff"
							/>
							<path
								d="m43.8263 48.6865-1.5235-5.8034-5.8167 1.5271 1.5404 5.8132 5.7998-1.5369ZM113.17 30.4816l5.805-1.5175-1.519-5.811-5.809 1.5252 1.523 5.8033ZM60.7338 112.492l-5.7998 1.537 1.5561 5.872 5.8527-1.629-1.609-5.78Zm.029-.008 5.7859-1.588-1.5939-5.807-5.801 1.615 1.609 5.78Zm.0564.2 5.8034-1.524-.0206-.078-.0227-.078-5.7601 1.68Zm68.7628-19.3473-1.609-5.7801-5.669 1.5782 1.468 5.6984 5.81-1.4965Zm.018-.0049 1.609 5.7801 5.689-1.584-1.493-5.7136-5.805 1.5175Zm-84.2501-38.842 69.3441-18.2049-3.047-11.6066-69.3442 18.2048 3.0471 11.6067Zm21.1838 56.4652L49.6261 47.1496l-11.5996 3.0738L54.934 114.029l11.5997-3.074Zm-7.3799-4.251-.0289.008 3.2179 11.56.0289-.008-3.2179-11.56Zm7.4255 4.3c-.0105-.036-.0207-.072-.0306-.108l-11.5719 3.176c.0267.098.0541.195.0824.291l11.5201-3.359Zm32.3865 6.869c-8.8241 2.316-16.8828 2.383-22.7855.806-5.9455-1.587-8.7607-4.483-9.5577-7.519l-11.6067 3.047c2.2913 8.728 9.7379 13.842 18.0686 16.066 8.3735 2.236 18.6058 1.917 28.9285-.793l-3.0472-11.607Zm24.8062-23.0398c.801 3.1099-.305 7.3928-4.765 12.0458-4.38 4.568-11.379 8.72-20.0412 10.994l3.0472 11.607c10.451-2.744 19.511-7.887 25.656-14.297 6.064-6.325 9.949-14.703 7.723-23.3428l-11.62 2.993Zm4.219-7.2816-.018.005 3.218 11.5603.018-.005-3.218-11.5603Zm-20.626-55.5525 16.43 62.8501 11.61-3.0349-16.43-62.8502-11.61 3.035Z"
								fill="#000"
								mask="url(#e)"
							/>
							<path
								d="M110.269 31.2423c.171.6542.082 1.7194-.992 3.3207-1.071 1.5965-2.929 3.4102-5.587 5.2845-5.2983 3.7348-13.2353 7.3313-22.5551 9.778-9.3198 2.4467-17.9999 3.2128-24.4491 2.562-3.2366-.3266-5.7457-.994-7.4628-1.8585-1.7223-.8671-2.3231-1.7511-2.4949-2.4054-.1717-.6542-.0826-1.7193.9916-3.3206 1.0711-1.5965 2.9288-3.4103 5.5876-5.2846 5.2978-3.7348 13.2349-7.3312 22.5547-9.778 9.3198-2.4467 17.9999-3.2127 24.449-2.5619 3.237.3266 5.746.9939 7.463 1.8584 1.722.8671 2.323 1.7512 2.495 2.4054Z"
								fill="#fff"
								stroke="#000"
								stroke-width="6"
							/>
							<path
								d="m48.8221 53.6165-9.5176 1.0312c-1.97.2135-3.4628 1.8768-3.4628 3.8583 0 2.0878 1.6516 3.8014 3.7379 3.8783l17.7185.6532m54.0089-25.4883 9.005-3.2476c1.864-.6723 3.935.1678 4.805 1.9485.915 1.8762.183 4.1407-1.659 5.1248l-15.636 8.3585"
								stroke="#000"
								stroke-width="6"
							/>
							<path
								d="M76.0616 106.631c-8.1247 13.108-25.1396 18.152-39.4336 11.138-14.294-7.015-20.7152-23.5591-15.3186-38.0055l54.7522 26.8675Z"
								fill="#fff"
								stroke="#161616"
								stroke-width="6"
							/>
							<path
								d="M77.5151 104.004c-.1886.384-.7589 1.013-2.462 1.437-1.6848.42-4.0729.521-7.0863.176-5.9989-.685-13.807-3.056-21.9224-7.0383-8.1153-3.9824-14.7682-8.7075-18.9808-13.0332-2.116-2.1728-3.4972-4.1236-4.1961-5.7131-.7065-1.6066-.5585-2.442-.3699-2.8264.1886-.3844.7588-1.0126 2.4619-1.4369 1.6849-.4197 4.073-.5208 7.0863-.1766 5.999.6853 13.8071 3.0565 21.9224 7.0388 8.1154 3.9823 14.7683 8.7074 18.9809 13.0331 2.116 2.1729 3.4972 4.1236 4.1961 5.7136.7065 1.606.5585 2.442.3699 2.826Z"
								fill="#fff"
								stroke="#161616"
								stroke-width="6"
							/>
						</g>
						<defs>
							<linearGradient
								id="c"
								x1="74.5001"
								y1="8.06931"
								x2="74.5001"
								y2="140.93"
								gradientUnits="userSpaceOnUse">
								<stop />
								<stop offset=".473958" stop-color="#666" />
								<stop offset="1" stop-color="#4E4E4E" />
							</linearGradient>
							<linearGradient
								id="d"
								x1="74.5001"
								y1="27.8558"
								x2="74.5001"
								y2="121.144"
								gradientUnits="userSpaceOnUse">
								<stop />
								<stop offset=".473958" stop-color="#666" />
								<stop offset="1" stop-color="#4E4E4E" />
							</linearGradient>
							<clipPath id="a">
								<rect
									width="149"
									height="149"
									rx="35"
									fill="#fff"
								/>
							</clipPath>
							<filter
								id="b"
								x="2.05322"
								y="2.05273"
								width="144.894"
								height="144.894"
								filterUnits="userSpaceOnUse"
								color-interpolation-filters="sRGB">
								<feFlood
									flood-opacity="0"
									result="BackgroundImageFix"
								/>
								<feBlend
									in="SourceGraphic"
									in2="BackgroundImageFix"
									result="shape"
								/>
								<feColorMatrix
									in="SourceAlpha"
									values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
									result="hardAlpha"
								/>
								<feOffset dy="4" />
								<feGaussianBlur stdDeviation="2" />
								<feComposite
									in2="hardAlpha"
									operator="arithmetic"
									k2="-1"
									k3="1"
								/>
								<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
								<feBlend
									in2="shape"
									result="effect1_innerShadow_962_1154"
								/>
								<feGaussianBlur
									stdDeviation="3"
									result="effect2_foregroundBlur_962_1154"
								/>
							</filter>
						</defs>
					</svg>

					<p style={{ marginLeft: "16" }}>Mensa Radar</p>
				</div>
				<div
					style={{
						display: "flex",
						width: "100%",
						textAlign: "right",
						color: "white",
						fontSize: 24,
						fontWeight: 700,
					}}>
					{title}
				</div>
			</div>
		),

		{
			width: 800,
			height: 400,
			fonts: [
				{
					name: "Noto",
					data: fontData,
				},
			],
		}
	)
}
