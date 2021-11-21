import Head from "next/head";
import Link from 'next/link'

import 'tailwindcss/tailwind.css'


export default function Home(props) {
	
  const mensen = [
    {
      name: "Golm",
      url: "golm"
    },
    {
      name: "Neues Palais",
      url: "neues-palais"
    },
    {
      name: "FHP",
      url: "fhp"
    }
  ]


  return (
    <div className="container mx-auto space-y-6">
      <Head>
        <title>Guckst du Essen — Mensen Potsdam</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="font-display text-5xl mt-9">
          Guckst du Essen
        </h1>
        <p className="mt-3">Die (etwas bessere) Mensa Übersicht für Potsdam</p>

        <div className="space-y-3 inline-flex flex-col my-9">
          {
            mensen.map(mensa => {
              return <Link href={'/'+mensa.url}>
                      <a className="inline-flex flex-initial rounded-xl border border-gray-200 px-8 py-4 hover:border-blue-400"><h3 className="text-xl font-bold">{mensa.name} &rarr;</h3></a>
                    </Link>
            })
          }
        </div>
      </main>

      <footer>
        <p>Designed and Developed by <a href="https://ericwaetke.com" target="_blank" className="text-blue-400">Eric Wätke</a> + <a href="https://martinzerr.de" target="_blank" className="text-blue-400">Martin Zerr</a></p>
      </footer>
    </div>
  );
}
