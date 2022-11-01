import Link from 'next/link'
import 'tailwindcss/tailwind.css'

const Footer = () => {
    return (
        <footer className="flex justify-between">
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