import Link from "next/link";
import Balancer from "react-wrap-balancer";

export default function Custom500() {
  return <div className="flex flex-col h-screen w-screen items-center justify-center">
    <div className="flex flex-col items-center">
      <h1 className="block text-h1 font-serif-bold text-center">
        <Balancer>
          Es gab ein Problem dir das Essen zu zeigen...
        </Balancer>
      </h1>
      <h2 className="font-serif-reg text-base text-center">Wahrscheinlich sind wir schon dabei, das Problem zu beseitigen!</h2>
      <Link href="/">
        <a className="mt-4 font-semibold h-14 border min-w-fit grow rounded-lg flex justify-center items-center gap-2 cursor-pointer px-4">
          Zurück zu Mensa Radar
        </a>
      </Link>
    </div>
  </div>
}
