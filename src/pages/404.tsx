import Link from "next/link";
import Balancer from "react-wrap-balancer";

export default function Custom404() {
	return <div className="flex h-screen w-screen flex-col items-center justify-center">
		<div className="flex flex-col items-center">
			<h1 className="text-h1 block text-center font-serif-bold">
				<Balancer>
          Wir konnten diese Mensa leider nicht finden!
				</Balancer>
			</h1>
			<h2 className="text-center font-serif-reg text-base">Oder etwas ist in der URL kaputt gegangen</h2>
			<Link href="/">
				<a className="mt-4 flex h-14 min-w-fit grow cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 font-semibold">
          Zurück zu Mensa Radar
				</a>
			</Link>
		</div>
	</div>
}
