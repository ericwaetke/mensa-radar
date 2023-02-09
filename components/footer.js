import Link from 'next/link'
import 'tailwindcss/tailwind.css'

const Footer = () => {
    return (
        <footer className="flex justify-between pb-2 fixed bottom-0 left-0 right-0 h-8 box-border max-w-xl mx-auto px-2">
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