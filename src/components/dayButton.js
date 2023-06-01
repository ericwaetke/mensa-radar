import 'tailwindcss/tailwind.css'

export const DayButton = ({mensa, day, isSelected, router}) => {
	const activeClass = isSelected ? "bg-main-green" : "bg-background-container"

	return (
		<button onClick={() => {router.push(`/mensa/${mensa}/${day.url}`)}} className="inline-flex">
			<a className={`${activeClass} text-green-w7 inline-flex h-max min-w-max flex-col items-start justify-center rounded-xl px-8 py-4 uppercase`}>
				<p className={`font-bold ${isSelected ? 'text-black' : null}`}>{day.mainText}</p>
				{
					isSelected ? 
						<>
							<p className="text-sm">
								{day.subText}
							</p>
						</> : null
				}
			</a>
		</button>
	)
}