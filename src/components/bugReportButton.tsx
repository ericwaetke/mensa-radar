import Image from "next/image"
import Link from "next/link"

export const BugReportButton = () => {
	return (
		<Link href="https://tally.so/r/mKeeeD" target={"_blank"}>
			<a className="mx-auto mb-16 w-full max-w-xl">
				<div className="flex justify-center gap-2 rounded-lg border border-gray/20 bg-black/20 py-4 font-sans">
					<span className="font-bold">Fehler gefunden?</span>
					<span>Melden</span>
					<Image
						src="/icons/right-arrw.svg"
						width={16}
						height={16}
						className="w-4"
						alt="Icon pointing to the right"
					/>
				</div>
			</a>
		</Link>
	)
}
