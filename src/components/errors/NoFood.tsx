export const NoFood = (
	{
		mainMessage
	}: {
		mainMessage: string
	}
) => {
	return (
		<div className="flex flex-col items-center">
			<p className="text-4xl">😋</p>
			<h1 className="font-sans-semi text-2xl">{mainMessage}</h1>
			<p className="font-sans-med">Wir haben auch schon Hunger 🫠</p>
		</div>
	);
}