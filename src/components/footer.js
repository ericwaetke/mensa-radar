import Link from 'next/link'
import 'tailwindcss/tailwind.css'

const Footer = () => {
	return (
		<footer className="fixed inset-x-0 bottom-0 mx-auto box-border flex h-8 max-w-xl justify-between px-2 pb-2">
			<p className="">
				<a href="https://ericwaetke.com" target="_blank" className="text-main-black">Eric Wätke</a> · <a href="https://www.instagram.com/carl.qq/" target="_blank" className="text-main-black">Carl Linz</a>
			</p>
			<Link href="/impressum">
				<a className="text-main-black">Impressum</a>
			</Link>
		</footer>
	)
}

export default Footer