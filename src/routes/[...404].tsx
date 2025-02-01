import { Header } from "~/components/Header"
import * as Sentry from "@sentry/solidstart";

export default function NotFound() {
	Sentry.captureMessage("404", "warning");
	return (
		<main class="h-full min-h-screen w-full bg-[#DDEDE2]">
			<Header />
			<div class="flex flex-col items-center w-full gap-4 py-20">
				<div class="flex flex-col items-center">
					<p class="font-bespoke text-left font-bold text-xl bg-white p-4 rounded-xl">
						Die Seite
						<br />
						haben wir leider
						<br />
						nicht gefunden!
					</p>
					<svg
						width="15"
						height="11"
						viewBox="0 0 15 11"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M7.5 11L15 -2.38419e-07H0L7.5 11Z"
							fill="white"
						/>
					</svg>
				</div>
				<svg
					width="216"
					height="216"
					viewBox="0 0 216 216"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M46.0231 187.016L28.5586 159.364V93.1444L36.5632 41.4785L64.2154 18.9201L120.247 3.63867L158.815 18.9201L185.739 50.2108L190.106 84.4122V126.618L185.739 165.186L155.176 200.842L91.1399 209.575L46.0231 187.016Z"
						fill="#C5FFD4"
					/>
					<mask
						id="mask0_88_1329"
						style="mask-type:alpha"
						maskUnits="userSpaceOnUse"
						x="23"
						y="32"
						width="173"
						height="139">
						<ellipse
							cx="109.332"
							cy="101.149"
							rx="85.8673"
							ry="69.1305"
							fill="#FFA68E"
						/>
					</mask>
					<g mask="url(#mask0_88_1329)">
						<g filter="url(#filter0_i_88_1329)">
							<ellipse
								cx="109.332"
								cy="69.1305"
								rx="85.8673"
								ry="69.1305"
								fill="url(#paint0_linear_88_1329)"
							/>
						</g>
					</g>
					<path
						d="M189.377 69.1305C189.377 102.98 154.782 132.439 109.332 132.439C63.8817 132.439 29.2859 102.98 29.2859 69.1305C29.2859 35.2809 63.8817 5.82151 109.332 5.82151C154.782 5.82151 189.377 35.2809 189.377 69.1305Z"
						stroke="black"
						stroke-width="11.643"
					/>
					<g filter="url(#filter1_i_88_1329)">
						<path
							d="M189.378 145.538C189.378 181.129 153.54 209.981 109.332 209.981C65.1239 209.981 29.2861 181.129 29.2861 145.538"
							stroke="black"
							stroke-width="11.643"
						/>
					</g>
					<path
						d="M185.012 110.609C198.676 110.609 209.753 99.5317 209.753 85.8674C209.753 72.2031 198.676 61.126 185.012 61.126"
						stroke="black"
						stroke-width="11.643"
					/>
					<path
						d="M30.7412 110.609C17.0769 110.609 5.99978 99.5317 5.99978 85.8674C5.99978 72.2031 17.0769 61.126 30.7412 61.126"
						stroke="black"
						stroke-width="11.643"
					/>
					<line
						x1="189.378"
						y1="145.538"
						x2="189.378"
						y2="68.4026"
						stroke="black"
						stroke-width="11.643"
					/>
					<line
						x1="29.2859"
						y1="145.538"
						x2="29.2859"
						y2="68.4026"
						stroke="black"
						stroke-width="11.643"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M83.6006 91.7687C83.2158 91.7767 82.8181 91.7801 82.4073 91.7801C79.0363 91.7801 77.2076 89.8522 75.4327 87.9811C73.7594 86.2169 72.1339 84.5032 69.3089 84.5032C65.8517 84.5032 62.0524 86.8985 58.9777 89.5553L50.6947 92.1307L48.5181 85.1305L53.7459 51.6045L63.692 52.9094L59.4664 80.3102L68.5735 77.4785L66.5032 67.4639L74.5896 62.7881L78.2243 74.4778L83.2536 72.914L85.8317 81.2055L80.8024 82.7693L83.6006 91.7687ZM75.7617 99.4453L75.1376 99.3087L75.2586 99.698L75.7617 99.4453Z"
						fill="#F9AA00"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M163.873 83.7315C162.217 84.9523 160.359 86.7497 158.505 88.5416C154.939 91.9911 151.392 95.4206 149.355 94.6797C148.466 94.3567 147.594 93.8967 146.728 93.3459L148.639 87.7247L128.558 80.8993L130.917 73.9584L154.871 49.9268L162.145 56.8343L142.606 76.5031L151.635 79.5722L155.854 70.2566L165.144 71.2341L161.204 82.8246L163.873 83.7315Z"
						fill="#F9AA00"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M124.343 55.2685C124.158 55.746 123.96 56.3235 123.737 56.9696C122.084 61.7759 119.125 70.379 110.787 69.8572C108.052 69.686 105.959 70.6401 104.13 71.474C102.066 72.4147 100.338 73.2024 98.4017 72.0492C97.2552 71.3665 96.1467 69.9169 94.952 68.3546C92.7103 65.4231 90.1649 62.0945 86.4944 62.688C86.2244 61.7985 85.9911 60.8733 85.7945 59.9124C84.9776 55.9204 84.9899 52.2722 85.8315 48.9678C86.7233 45.6532 88.4293 42.8651 90.9497 40.6035C93.46 38.2927 96.7997 36.7107 100.969 35.8575C105.038 35.0249 108.635 35.213 111.761 36.4219C114.937 37.6205 117.546 39.6283 119.588 42.4453C121.67 45.2028 123.114 48.5529 123.921 52.4956C124.113 53.4354 124.254 54.3597 124.343 55.2685ZM111.495 63.8957C110.663 65.9659 109.242 67.2066 107.233 67.6177C105.274 68.0186 103.469 67.3865 101.82 65.7214C100.161 64.0071 98.9382 61.2278 98.1516 57.3837C97.3751 53.5889 97.3929 50.6071 98.2052 48.4383C99.0074 46.2203 100.438 44.9005 102.498 44.4791C104.708 44.0268 106.572 44.6979 108.091 46.4924C109.65 48.2273 110.822 51.0169 111.609 54.861C112.416 58.8037 112.378 61.8152 111.495 63.8957Z"
						fill="#F9AA00"
					/>
					<defs>
						<filter
							id="filter0_i_88_1329"
							x="23.4644"
							y="0"
							width="171.735"
							height="177.556"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB">
							<feFlood
								flood-opacity="0"
								result="BackgroundImageFix"
							/>
							<feBlend
								mode="normal"
								in="SourceGraphic"
								in2="BackgroundImageFix"
								result="shape"
							/>
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dy="39.2952" />
							<feGaussianBlur stdDeviation="25.4691" />
							<feComposite
								in2="hardAlpha"
								operator="arithmetic"
								k2="-1"
								k3="1"
							/>
							<feColorMatrix
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
							/>
							<feBlend
								mode="normal"
								in2="shape"
								result="effect1_innerShadow_88_1329"
							/>
						</filter>
						<filter
							id="filter1_i_88_1329"
							x="23.4648"
							y="145.538"
							width="171.734"
							height="70.2651"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB">
							<feFlood
								flood-opacity="0"
								result="BackgroundImageFix"
							/>
							<feBlend
								mode="normal"
								in="SourceGraphic"
								in2="BackgroundImageFix"
								result="shape"
							/>
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset />
							<feGaussianBlur stdDeviation="25.4691" />
							<feComposite
								in2="hardAlpha"
								operator="arithmetic"
								k2="-1"
								k3="1"
							/>
							<feColorMatrix
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
							/>
							<feBlend
								mode="normal"
								in2="shape"
								result="effect1_innerShadow_88_1329"
							/>
						</filter>
						<linearGradient
							id="paint0_linear_88_1329"
							x1="109.332"
							y1="32.746"
							x2="109.332"
							y2="125.163"
							gradientUnits="userSpaceOnUse">
							<stop stop-color="#FFE8A3" />
							<stop offset="1" stop-color="#FFDF7E" />
						</linearGradient>
					</defs>
				</svg>
			</div>
		</main>
	)
}
