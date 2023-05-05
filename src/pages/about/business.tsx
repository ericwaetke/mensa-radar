
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import aboutStyle from "./about.module.css"
import Balancer from 'react-wrap-balancer'
import Footer from "../../components/footer";

export default function AboutBusiness () {

	return (
		<div className="flex h-full flex-col justify-between space-y-6 bg-[#DAFFE4] p-4 pb-0 lg:mx-auto lg:px-[10%] lg:pb-4">
			<Head>
				<title>About Mensa Radar</title>
			</Head>

			<main>
				<div className="flex items-center justify-between">
					<h1 className="font-serif-bold text-3xl">Mensa Radar</h1>
					
					{/* Contact Us Button with an Email Href */}
					<Link href="mailto:mensaradar@wovenspace.xyz">
						<a className="text-md rounded-lg border-2 border-black/80 bg-black/80 px-4 py-2 font-sans-semi text-main-green">Contact Us</a>
					</Link>
				</div>

				<div className="relative mt-28 grid h-full overflow-x-clip overflow-y-visible">
					<div className="relative z-10 col-start-1 col-end-1 row-start-1 row-end-1">
						<h2 className="font-sans-black text-6xl">
							Making<br />Food<br />Visible.
						</h2>

						{/* CTA Area */}
						<div className="mt-12 inline-flex flex-col items-center space-y-4">
							{/* CTA Button */}
							<Link href="mailto:mensaradar@wovenspace.xyz">
								<a className="text-md rounded-lg border-2 border-black/80 bg-black/80 px-4 py-2 font-sans-semi text-main-green">I&apos;ve got food to show!</a>
							</Link>
							<Link href="/">
								<a className="flex gap-1 px-4 font-sans-semi">
									Take me to the app!
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path d="M0 0h24v24H0z" stroke="none"/>
										<path d="M17 7 7 17M8 7h9v9"/>
									</svg>
								</a>
							</Link>

						</div>
					</div>

					{/* Radar */}
					<div className={aboutStyle.radar}>
						<div className={aboutStyle.outer_circle}></div>
						<div className={aboutStyle.outer_circle}></div>
						<div className={aboutStyle.outer_circle}></div>
						<div className={aboutStyle.outer_circle}></div>
						<div className={aboutStyle.outer_circle}></div>
						<img src="/icons/Topf.svg" className={aboutStyle.topf}/>
						<img src="/icons/Topf.svg" className={aboutStyle.topf}/>
						<img src="/icons/Topf.svg" className={aboutStyle.topf}/>
						<img src="/icons/Topf.svg" className={aboutStyle.topf}/>
						<img src="/icons/Topf.svg" className={aboutStyle.topf}/>
					</div>
				</div>

				<div className="mt-16 flex flex-col gap-4">
					<Balancer>
						<h2 className="font-sans-black text-5xl">
							Harnessing the power of<br /><span className={aboutStyle.ai_text}>AI.</span>
						</h2>
					</Balancer>
					<p className="w-4/5 font-sans">
						We use AI to detect the food in the pictures you send us. This way we can show you the food you want to see.
						<br /><br />
						When neither you nor our users have sent us a picture of a certain dish, we will use diffusion models to generate a picture, so you can still see what the dish looks like.
					</p>
				</div>

				<div className="mt-16 flex flex-col gap-4">
					<Balancer>
						<h2 className="font-sans-black text-5xl">
							Showing users the food they want.
						</h2>
					</Balancer>
					<p className="w-4/5 font-sans">
						Users can rate the food they see, and they can filter out specific groups of food or ingredients.
						<br /><br />
						When neither you nor our users have sent us a picture of a certain dish, we will use diffusion models to generate a picture, so you can still see what the dish looks like.
					</p>
				</div>

				<div className="mt-28">
					<p className="font-sans-bold">
						wovenspace.xyz - 2023
					</p>
				</div>
			</main>
		</div>
	)
}