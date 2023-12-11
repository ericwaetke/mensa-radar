/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router"
import Head from "next/head"
import { useEffect, useState } from "react"

export const runtime = "experimental-edge"

export default function Mensa(): JSX.Element {
	const router = useRouter()
	const { mensa } =
		router.query !== undefined ? router.query : { mensa: "Mensa not Found" }

	const currentDate = new Date()
	const currentWeekday =
		currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1
	const weekday = [
		"montag",
		"dienstag",
		"mittwoch",
		"donnerstag",
		"freitag",
		"samstag",
		"sonntag",
	]
	let [selectedMensa, setSelectedMensa] = useState({
		title: "Mensa not Found",
		description: "Mensa not Found",
		body: <></>,
	})
	useEffect(() => {
		const mensa = router.query.mensa
		if (mensa === undefined) return
		if (mensaInformation[mensa.toString()])
			setSelectedMensa(mensaInformation[mensa.toString()])

		// Check if site is accessed by crawling bot
		// Checking user agent
		const userAgent = window.navigator.userAgent
		if (
			userAgent.includes("Googlebot") ||
			userAgent.includes("bingbot") ||
			userAgent.includes("YandexBot") ||
			userAgent.includes("Baiduspider") ||
			userAgent.includes("DuckDuckBot") ||
			userAgent.includes("Sogou") ||
			userAgent.includes("Exabot") ||
			userAgent.includes("ia_archiver") ||
			userAgent.includes("Facebot") ||
			userAgent.includes("facebookexternalhit") ||
			userAgent.includes("Slackbot")
		)
			return
		router.push(`/mensa/${mensa}/${weekday[currentWeekday]}`)
	}, [router.query])

	const mensaInformation: Record<
		string,
		{
			title: string
			description: string
			body: JSX.Element
		}
	> = {
		fhp: {
			title: "Mensa Kiepenheuerallee/Fachhochschule Potsdam",
			description:
				"Die Mensa Kiepenheuerallee ist auf dem Campus der Fachhochschule Potsdam",
			body: (
				<>
					<p>
						Auf dem Campus der Fachhochschule Potsdam gelegen, ist
						die Mensa Kiepenheuerallee als kulinarischer Knotenpunkt
						für Studierende und Besucher gleichermaßen.
					</p>
					<p>
						Die im Frühjahr 2009 eröffnete Mensa Kiepenheuerallee
						ist ein fester Bestandteil des wachsenden Campus der
						FHP. In zwei großzügigen Mensen und einer Cafeteria
						bietet die Mensa während des Semesters täglich ein Menü
						mit regionalen und internationalen Gerichten an. Durch
						die Verwendung saisonaler und regionaler Produkte trägt
						die Mensa zu einem nachhaltigen Speiseplan bei. Vegane
						Optionen sind an jedem Wochentag verfügbar, wobei der
						»Veggie-Wednesday« eine exklusive vegane und
						vegetarische Auswahl bietet. Entdecken Sie die Mensa
						Kiepenheuerallee für eine Vielzahl von Mahlzeiten und
						einen bequemen Essensstandort auf dem Campus der
						Fachhochschule Potsdam.
					</p>
				</>
			),
		},
		golm: {
			title: "Mensa Golm",
			description:
				"Die Mensa Golm ist auf dem Campus der Universität Potsdam",
			body: (
				<>
					<p>
						Die Mensa Golm, eingebettet zwischen Hörsälen und
						studentischen Wohnanlagen auf dem Campus der Universität
						Potsdam im Wissenschaftsstandort Golm, ist ein beliebter
						Anlaufpunkt für Studierende und Besucher. Das Gebäude
						ist durch einen umlaufenden Arkadengang komplett
						umschlossen, ermöglicht Mahlzeiten im Freien bei fast
						jedem Wetter und bietet auf zwei Ebenen ausreichend
						Platz. Eine großzügige Terrasse lädt dazu ein, das
						Mittagessen unter freiem Himmel zu genießen, besonders
						an warmen Tagen.
					</p>
					<p>
						Die Mensa Golm präsentiert ein vielfältiges
						Speisenangebot von Montag bis Freitag. Neben der
						Möglichkeit, täglich vegane Gerichte zu genießen, stehen
						jeden Mittwoch ausschließlich vegane und vegetarische
						Angebote auf dem Speiseplan. Entdecken Sie die
						entspannte Atmosphäre der Mensa Golm, erleben Sie
						kulinarische Vielfalt und genießen Sie eine angenehme
						Essensumgebung auf dem lebendigen Campus des
						Wissenschaftsstandorts Golm der Universität Potsdam.
					</p>
				</>
			),
		},
		filmuniversitaet: {
			title: "Mensa Filmuniversität Babelsberg KONRAD WOLF",
			description:
				"Die Mensa Filmuniversität Babelsberg KONRAD WOLF ist auf dem Campus der Filmuniversität Babelsberg KONRAD WOLF",
			body: (
				<>
					<p>
						Im neu eingeweihten Haus 6 öffnete die Mensa der
						Filmuniversität Babelsberg KONRAD WOLF erstmals im Mai
						2021 ihre Pforten. Mit 100 Plätzen im Innenbereich und
						weiteren 120 Plätzen auf einer großen wettergeschützten
						Außenterrasse bietet die Mensa eine gemütliche
						Verpflegungsmöglichkeit für Studierende und Beschäftigte
						der Filmuniversität. Das kulinarische Konzept legt dabei
						besonderen Wert auf ein vielfältiges vegetarisch-veganes
						Angebot. Genießen Sie hausgemachte Spezialitäten wie
						Limonaden und erleben Sie live zubereitete Gerichte im
						offenen Küchenbereich.
					</p>
					<p>
						Übrigens: Am »Veggie Wednesday« stehen jeden Mittwoch
						exklusiv vegane und vegetarische Angebote auf dem
						Speiseplan. Tauchen Sie ein in die entspannte Atmosphäre
						der Mensa und lassen Sie sich von einer breiten Auswahl
						an hausgemachten Leckereien verwöhnen.
					</p>
				</>
			),
		},
		"neues-palais": {
			title: "Mensa Am Neuen Palais",
			description:
				"Die Mensa Am Neuen Palais ist auf dem Campus der Universität Potsdam",
			body: (
				<>
					<p>
						Im nördlichen Teil des Schlossparks Sanssouci finden Sie
						unsere Mensa »Am Neuen Palais«. Das historische
						Wirtschaftsgebäude, das die zweigeschossige Mensa
						beherbergt, vermittelt einen Hauch des prachtvollen
						UNESCO-Weltkulturerbes. Der Innenhof der Mensa bietet
						zahlreiche Außenplätze, die in angenehmer Atmosphäre zum
						Verweilen einladen.
					</p>
					<p>
						Die Mensa »Am Neuen Palais« bietet von Montag bis
						Freitag ein vielfältiges Speisenangebot, darunter auch
						vegane Optionen. Besonders hervorzuheben ist der »Veggie
						Wednesday«, an dem ausschließlich vegane und
						vegetarische Köstlichkeiten auf dem Speiseplan stehen.
						Erleben Sie kulinarischen Genuss inmitten historischer
						Pracht und entspannen Sie im einzigartigen Ambiente der
						Mensa »Am Neuen Palais«.
					</p>
				</>
			),
		},
		griebnitzsee: {
			title: "Mensa Griebnitzsee",
			description:
				"Die Mensa Griebnitzsee ist auf dem Campus der Universität Potsdam",
			body: (
				<>
					<p>
						Zentral am Bahnhof Griebnitzsee gelegen, verbindet die
						Mensa Griebnitzsee die drei Hochschulstandorte der
						Universität Potsdam durch eine tägliche Zugverbindung.
						Diese Mensa zeichnet sich als eine der größten aus und
						bietet neben ihrem vielfältigen Speisenangebot eine
						besondere Nudelbar. Die Kaffeebar »Die Bohne« befindet
						sich nur wenige Schritte weiter im Foyer von Haus 6 und
						lockt mit verschiedenen Kaffeespezialitäten und Snacks.
					</p>
				</>
			),
		},
		wildau: {
			title: "Mensa Wildau/Technische Hochschule Wildau",
			description:
				"Die Mensa Wildau ist auf dem Campus der Technischen Hochschule Wildau",
			body: (
				<>
					<p>
						Erleben Sie modernes Essen in historischen Mauern in
						unserer zweigeschossigen Mensa, einst eine Werkhalle,
						auf dem angenehm gestalteten Campus der Technischen
						Hochschule Wildau. Das historische Ambiente bildet den
						perfekten Rahmen für täglich frisch zubereitete
						Gerichte. Neben der Mensa befinden sich die Cafeteria
						und die Kaffeebar »HaSi«, die gemeinsam einen belebten
						Treffpunkt auf dem Campus bilden und nur wenige Meter
						vom S-Bahnhof Wildau entfernt liegen.
					</p>
					<p>
						Die Mensa Wildau setzt auf gastronomische Vielfalt und
						bietet von Montag bis Freitag eine Auswahl an veganen
						Gerichten. Der »Veggie-Wednesday« präsentiert dabei
						exklusiv vegane und vegetarische Optionen. Genießen Sie
						eine zeitgemäße Kulinarik in historischer Kulisse und
						lassen Sie sich von unserem vielfältigen Speiseangebot
						auf dem Campus der Technischen Hochschule Wildau
						begeistern.
					</p>
				</>
			),
		},
		brandenburg: {
			title: "Mensa Brandenburg/Technische Hochschule Brandenburg",
			description:
				"Die Mensa Brandenburg ist auf dem Campus der Technischen Hochschule Brandenburg",
			body: (
				<>
					<p>
						Direkt auf dem Campus der Technischen Hochschule
						Brandenburg und in unmittelbarer Nähe unserer
						studentischen Wohnanlage Zanderstraße befindet sich die
						Mensa Brandenburg. Inmitten des Semesters präsentieren
						wir täglich eine Auswahl an regionalen und
						internationalen Gerichten. Die Cafeteria, räumlich von
						der Mensa getrennt und im Erdgeschoss gelegen, bietet
						eine Auswahl an Snacks, Heißgetränken und einer
						wechselnden Tagessuppe.
					</p>
					<p>
						Die Mensa Brandenburg steht im Zeichen kulinarischer
						Vielfalt und bietet von Montag bis Freitag auch vegane
						Speisen an. Besonders hervorzuheben ist der »Veggie
						Wednesday«, an dem ausschließlich vegane und
						vegetarische Köstlichkeiten auf dem Speiseplan stehen.
						Entdecken Sie die entspannte Atmosphäre der Mensa
						Brandenburg, Ihr gastronomischer Treffpunkt auf dem
						Campus der Technischen Hochschule Brandenburg.
					</p>
				</>
			),
		},
	} as const

	return (
		<>
			<div className="mx-auto flex flex-col">
				<Head>
					<title>{selectedMensa.title} - Mensa Radar</title>
					<meta
						name="description"
						content={selectedMensa.description}
					/>
					<meta property="twitter:domain" content="mensa-radar.de" />
					<meta
						property="og:url"
						content={`https://mensa-radar.de/mensa/` + mensa}
					/>
					<meta
						property="twitter:url"
						content={`https://mensa-radar.de/mensa/` + mensa}
					/>
					<meta
						property="og:title"
						content={`${selectedMensa.title} - Mensa Radar`}
					/>
					<meta property="og:site_name" content="Mensa Radar" />
					<meta
						property="og:description"
						content={selectedMensa.description}
					/>
					<meta
						name="twitter:description"
						content={selectedMensa.description}
					/>
					<meta property="og:type" content="website" />
					<meta property="og:locale" content="de_DE" />
				</Head>

				<div className="flex flex-col gap-2">
					<h1 className="text-h1 block font-serif-bold">
						Über {selectedMensa.title}
					</h1>
					{selectedMensa.body}
				</div>
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-light-green">
					<p className="text-h1 block font-serif-bold">
						Lade Essensangebote...
					</p>
					<div role="status">
						<svg
							aria-hidden="true"
							className="h-8 w-8 animate-spin fill-dark-green text-green-50"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span className="sr-only">Loading...</span>
					</div>
				</div>
			</div>
		</>
	)
}
