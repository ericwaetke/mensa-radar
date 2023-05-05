import 'tailwindcss/tailwind.css'

export const DayButton = ({mensa, day, isSelected, router}) => {
	const activeClass = isSelected ? "bg-main-green" : "bg-background-container"

	return (
		<button onClick={() => {router.push(`/mensa/${mensa}/${day.url}`)}} className="inline-flex">
			<a className={`${activeClass} h-max px-8 py-4 inline-flex min-w-max flex-col items-start justify-center rounded-xl text-green-w7 uppercase`}>
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
		</button> //TODO: Current Day Border does not work yet
	)
}