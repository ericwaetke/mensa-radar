
import Head from "next/head";
import Link from "next/link";
import Footer from "../components/footer";

export default function Impressum () {

	return (
		<div className="p-4 pb-0 space-y-6 lg:w-1/2 lg:px-0 lg:pb-4 lg:mx-auto flex flex-col h-screen justify-between">
			<Head>
				<title>Mensa Radar — Mensen Potsdam</title>
			</Head>

			<main>
				<Link href="/">
					<a className="p-2 pl-0 flex items-center gap-4">
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M11.1426 6.75C11.5568 6.75 11.8926 6.41421 11.8926 6C11.8926 5.58579 11.5568 5.25 11.1426 5.25V6.75ZM0.326533 5.46967C0.0336397 5.76256 0.0336397 6.23744 0.326533 6.53033L5.0995 11.3033C5.3924 11.5962 5.86727 11.5962 6.16016 11.3033C6.45306 11.0104 6.45306 10.5355 6.16016 10.2426L1.91752 6L6.16016 1.75736C6.45306 1.46447 6.45306 0.989592 6.16016 0.696699C5.86727 0.403806 5.3924 0.403806 5.0995 0.696699L0.326533 5.46967ZM11.1426 5.25L0.856863 5.25V6.75L11.1426 6.75V5.25Z" fill="black"/>
						</svg>
						<h2 className="text-lg font-bold text-center w-full">Zurück zur Übersicht</h2>
					</a>
				</Link>
				<div className="font-sans-reg">
					<h1 className="text-3xl mt-8 mb-4">Über Mensa Radar</h1>
					<h2 className="font-sans-bold mt-4">Wer sind wir?</h2>
					<p>Mensa Radar ist ein Projekt von Eric Wätke und Carl Linz. Wir sind unabhängig und in keinem Verhältnis zum Studentenwerk Potsdam!</p>


					<h2 className="font-sans-bold mt-4">Sticker</h2>
					<p>Unsere Sticker sind ausschließlich für Privatgebrauch. Zusätzlich bitten wir darum, dass sie NICHT auf dem Gelände des Studentenwerks geklebt werden.</p>
					
					<h2 className="font-sans-bold mt-4">Quellen</h2>
					<p><a href="https://icons8.com/">Icons von icons8.</a></p>
					<br />
					<p>Sämtliche Essens-Daten sind ohne Gewähr, da wir sie nicht kuratieren.</p>
					<p>Wir beziehen unsere Daten (aktuell) ausschließlich von öffentlichen Endpunkten des Studentenwerk Potsdam.</p>

					<h1 className="text-3xl mt-8 mb-4">Impressum</h1>
					<h2 className="font-sans-bold mt-4">Diensteanbieter</h2>
					<p>Eric Wätke</p>
					<p>Benziner Chaussee 2</p>
					<p>19386 Lübz</p>
					<h2 className="font-sans-bold mt-4">Kontaktmöglichkeiten</h2>
					E-Mail-Adresse: 
					<p><a href="mailto:email@ericwaetke.de">email@ericwaetke.de</a></p>
					Telefon: 
					<p>01719388606</p>
					<h2 className="font-sans-bold mt-4">Haftungs- und Schutzrechtshinweise</h2>
					<p>Haftungsausschluss: Die Inhalte dieses Onlineangebotes wurden sorgfältig und nach unserem aktuellen Kenntnisstand erstellt, dienen jedoch nur der Information und entfalten keine rechtlich bindende Wirkung, sofern es sich nicht um gesetzlich verpflichtende Informationen (z.B. das Impressum, die Datenschutzerklärung, AGB oder verpflichtende Belehrungen von Verbrauchern) handelt. Wir behalten uns vor, die Inhalte vollständig oder teilweise zu ändern oder zu löschen, soweit vertragliche Verpflichtungen unberührt bleiben. Alle Angebote sind freibleibend und unverbindlich. </p>
					<p>Hinweise auf Rechtsverstöße: Sollten Sie innerhalb unseres Internetauftritts Rechtsverstöße bemerken, bitten wir Sie uns auf diese hinzuweisen. Wir werden rechtswidrige Inhalte und Links nach Kenntnisnahme unverzüglich entfernen.</p>
				</div>
			</main>
			<Footer />
		</div>
	)
}