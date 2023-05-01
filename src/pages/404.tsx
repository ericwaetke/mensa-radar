import Link from "next/link";

export default function Custom404() {
	return <div>
		<h1>404 - Server-side error occurred</h1>
		<Link href="/">
			<a>Go back to the homepage</a>
		</Link>
	</div>
}