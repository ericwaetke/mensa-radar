const LoadingSkeleton = () => {
	return <div className='my-4 p-5 flex flex-col gap-8 rounded-xl bg-background-container'>
				<div className="flex flex-col gap-2">
					<div className="h-6 w-full rounded bg-white/75 animate-pulse"></div>
					<div className="h-6 w-1/2 rounded bg-white/75 animate-pulse"></div>
				</div>

				<div className="flex justify-between">
					<div className="h-6 w-24 rounded-full bg-white/75 animate-pulse"></div>
					<div className="h-6 w-24 rounded-full bg-white/75 animate-pulse"></div>
				</div>
			</div>
}

export default function Loading() {
	return (
		<div>
			<LoadingSkeleton />
			<LoadingSkeleton />
			<LoadingSkeleton />
		</div>
	)
}