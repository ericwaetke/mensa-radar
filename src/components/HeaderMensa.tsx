import { createMemo, VoidComponent } from "solid-js"
import { Logo } from "./Logo"
import { mensa } from "@/schema"
import { InferSelectModel } from "drizzle-orm"
import { ChevronUp } from "./icons"
import { useNavigate, useParams } from "@solidjs/router"

import { DatePicker } from "@ark-ui/solid/date-picker"
import { Index, Portal } from "solid-js/web"
import { MetaProvider, Title, Meta } from "@solidjs/meta"

export const HeaderMensa: VoidComponent<{
	mensa?: InferSelectModel<typeof mensa>
}> = (props) => {
	const navigate = useNavigate()
	const params = useParams()

	const currentDate = params.date
	const parsedDate = createMemo(() => {
		return parseDate(params.date)
	})

	function parseDate(dateStr: string) {
		const [day, month, year] = dateStr.split("-")
		// Note: JavaScript months are 0-based (0 for January, 11 for December)
		return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
	}

	function goToDate(options: { offset?: number }) {
		const { offset } = options
		if (offset) {
			const nextDate = new Date(parsedDate())
			nextDate.setDate(nextDate.getDate() + offset)
			const nextDateString = nextDate
				.toLocaleDateString("de-DE")
				.split(".")
				.join("-")
			navigate(`/${params.provider}/${params.mensa}/${nextDateString}`, {
				replace: true,
			})
		}
	}

	function getStartOfWeek(date: Date) {
		const startOfWeek = new Date(date)
		const day = startOfWeek.getDay()
		const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Sunday (0)
		startOfWeek.setDate(diff)
		startOfWeek.setHours(0, 0, 0, 0) // Set time to 00:00:00
		return startOfWeek
	}

	function areDatesInSameWeek(date1: Date, date2: Date) {
		const startOfWeek1 = getStartOfWeek(date1)
		const startOfWeek2 = getStartOfWeek(date2)
		return startOfWeek1.getTime() === startOfWeek2.getTime() // Compare start of the weeks
	}

	function getDateString(date: Date) {
		// Check if its within the same calendar week
		if (areDatesInSameWeek(new Date(), date)) {
			// Check if its today
			if (date.toDateString() === new Date().toDateString()) {
				return "Heute"
			}
			return date.toLocaleDateString("de-DE", { weekday: "long" })
		}
		return date.toLocaleDateString("de-DE")
	}

	return (
		<div class="bg-white">
			<MetaProvider>
				<Title>
					{getDateString(parsedDate())} · {props.mensa?.name} · Mensa
					Radar
				</Title>
				<Meta
					property="og:image"
					content="https://mensa-radar.de/og.png"
				/>
			</MetaProvider>
			<div class="w-full px-4 pb-2 pt-16 flex flex-col justify-center gap-4 max-w-5xl mx-auto">
				<a href="/" class="flex w-full justify-between items-center">
					<ChevronUp class="-rotate-90" />
					<h1 class="text-[18px] font-bold">{props.mensa?.name}</h1>
					<div />
				</a>
				<div class="flex justify-end items-end">
					{/* Opening Times */}
					{/* <div class='h-fit bg-[#DCD631] text-[#494835] rounded-[4px] px-2 py-1 inline-block font-noto text-[12px] font-semibold'>Öffnungszeiten nicht verfügbar</div> */}

					{/* Date Picker */}
					<div class="bg-[#DDEDE2] rounded-[4px] flex font-noto text-base">
						<button
							class="h-9 w-9 flex items-center justify-center border-r border-black/15"
							onClick={() => {
								goToDate({ offset: -1 })
							}}>
							<ChevronUp class="-rotate-90" />
						</button>

						{/* <DatePicker.Root>
							<DatePicker.Control>
								<DatePicker.Trigger class="w-[106px]">
									{getDateString(parsedDate())}
								</DatePicker.Trigger>
							</DatePicker.Control>

							<Portal>
								<DatePicker.Positioner>
									<DatePicker.Content class="bg-white p-2 rounded-md">
										<DatePicker.View view="day">
											<DatePicker.Context>
												{(context) => (
													<>
														<DatePicker.ViewControl>
															<DatePicker.PrevTrigger>
																Prev
															</DatePicker.PrevTrigger>
															<DatePicker.ViewTrigger>
																<DatePicker.RangeText />
															</DatePicker.ViewTrigger>
															<DatePicker.NextTrigger>
																Next
															</DatePicker.NextTrigger>
														</DatePicker.ViewControl>

														<DatePicker.Table>
															<DatePicker.TableHead>
																<DatePicker.TableRow>
																	<Index
																		each={
																			context()
																				.weekDays
																		}>
																		{(
																			weekDay
																		) => (
																			<DatePicker.TableHeader>
																				{
																					weekDay()
																						.short
																				}
																			</DatePicker.TableHeader>
																		)}
																	</Index>
																</DatePicker.TableRow>
															</DatePicker.TableHead>

															<DatePicker.TableBody>
																<Index
																	each={
																		context()
																			.weeks
																	}>
																	{(week) => (
																		<DatePicker.TableRow>
																			<Index
																				each={week()}>
																				{(
																					day
																				) => (
																					<DatePicker.TableCell
																						value={day()}>
																						<DatePicker.TableCellTrigger>
																							{
																								day()
																									.day
																							}
																						</DatePicker.TableCellTrigger>
																					</DatePicker.TableCell>
																				)}
																			</Index>
																		</DatePicker.TableRow>
																	)}
																</Index>
															</DatePicker.TableBody>
														</DatePicker.Table>
													</>
												)}
											</DatePicker.Context>
										</DatePicker.View>

										<DatePicker.View view="month">
											<DatePicker.Context>
												{(context) => (
													<>
														<DatePicker.ViewControl>
															<DatePicker.PrevTrigger>
																Prev
															</DatePicker.PrevTrigger>
															<DatePicker.ViewTrigger>
																<DatePicker.RangeText />
															</DatePicker.ViewTrigger>
															<DatePicker.NextTrigger>
																Next
															</DatePicker.NextTrigger>
														</DatePicker.ViewControl>

														<DatePicker.Table>
															<DatePicker.TableBody>
																<Index
																	each={context().getMonthsGrid(
																		{
																			columns: 4,
																			format: "short",
																		}
																	)}>
																	{(
																		months
																	) => (
																		<DatePicker.TableRow>
																			<Index
																				each={months()}>
																				{(
																					month
																				) => (
																					<DatePicker.TableCell
																						value={
																							month()
																								.value
																						}>
																						<DatePicker.TableCellTrigger>
																							{
																								month()
																									.label
																							}
																						</DatePicker.TableCellTrigger>
																					</DatePicker.TableCell>
																				)}
																			</Index>
																		</DatePicker.TableRow>
																	)}
																</Index>
															</DatePicker.TableBody>
														</DatePicker.Table>
													</>
												)}
											</DatePicker.Context>
										</DatePicker.View>

										<DatePicker.View view="year">
											<DatePicker.Context>
												{(context) => (
													<>
														<DatePicker.ViewControl>
															<DatePicker.PrevTrigger>
																Prev
															</DatePicker.PrevTrigger>
															<DatePicker.ViewTrigger>
																<DatePicker.RangeText />
															</DatePicker.ViewTrigger>
															<DatePicker.NextTrigger>
																Next
															</DatePicker.NextTrigger>
														</DatePicker.ViewControl>

														<DatePicker.Table>
															<DatePicker.TableBody>
																<Index
																	each={context().getYearsGrid(
																		{
																			columns: 4,
																		}
																	)}>
																	{(
																		years
																	) => (
																		<DatePicker.TableRow>
																			<Index
																				each={years()}>
																				{(
																					year
																				) => (
																					<DatePicker.TableCell
																						value={
																							year()
																								.value
																						}>
																						<DatePicker.TableCellTrigger>
																							{
																								year()
																									.label
																							}
																						</DatePicker.TableCellTrigger>
																					</DatePicker.TableCell>
																				)}
																			</Index>
																		</DatePicker.TableRow>
																	)}
																</Index>
															</DatePicker.TableBody>
														</DatePicker.Table>
													</>
												)}
											</DatePicker.Context>
										</DatePicker.View>
									</DatePicker.Content>
								</DatePicker.Positioner>
							</Portal>
						</DatePicker.Root> */}
						<button class="w-[106px]">
							{getDateString(parsedDate())}
						</button>

						<button
							class="h-9 w-9 flex items-center justify-center border-l border-black/15"
							onClick={() => {
								goToDate({ offset: 1 })
							}}>
							<ChevronUp class="rotate-90" />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
