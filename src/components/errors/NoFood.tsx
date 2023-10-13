import Balancer from "react-wrap-balancer"

export const NoFood = ({ mainMessage }: { mainMessage: string }) => {
	return (
		<div className="flex flex-col items-center px-3 text-center">
			<p className="text-4xl">😋</p>
			<Balancer>
				<h1 className="font-sans-semi text-2xl">{mainMessage}</h1>
			</Balancer>
			<Balancer>
				<p className="font-sans-med">Wir haben auch schon Hunger 🫠</p>
			</Balancer>
		</div>
	)
}
