import Link from 'next/link'
import 'tailwindcss/tailwind.css'

const Footer = () => {
	return (
		<footer className='fixed bottom-0 h-10 w-full border-t border-gray/10 bg-light-green px-3 py-2'>
			<div className="mx-auto grid max-w-xl grid-cols-2">
				<div className="flex flex-row space-x-2">
					<Link href="/impressum">
						<a className='font-sans-semi text-sm opacity-50'>
							Über Mensa-Radar
						</a>
					</Link>
				</div>
				
				<div className="flex flex-row-reverse space-x-2">
					<p className='font-sans-semi text-sm opacity-50'>
						woven
					</p>
				</div>

			</div>
		</footer>
	)
}

export default Footer