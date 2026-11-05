import { createMemo, Show, VoidComponent } from "solid-js"
import { Logo } from "./Logo"
import { mensa } from "@/schema"
import { InferSelectModel } from "drizzle-orm"
import { ChevronUp } from "./icons"
import { useNavigate, useParams } from "@solidjs/router"
import {
	addDays,
	formatDisplayDate,
	formatRouteDate,
	formatWeekday,
	isSameDay,
	isSameWeek,
	parseRouteDate,
	todayBerlin,
	type CalendarDate,
} from "~/lib/date"
import {
	formatHeaderSummary,
	formatServiceRange,
	openingInfo,
	type OpeningDayRow,
} from "~/lib/openingTimes"

import { DatePicker } from "@ark-ui/solid/date-picker"
import { Index, Portal } from "solid-js/web"
import { MetaProvider, Title, Meta } from "@solidjs/meta"

export const HeaderMensa: VoidComponent<{
	mensa?: InferSelectModel<typeof mensa>
	openingDays?: OpeningDayRow[]
}> = (props) => {
	const navigate = useNavigate()
	const params = useParams()

	const parsedDate = createMemo(() => {
		return parseRouteDate(params.date)
	})

	// Unparsable URLs fall back to today so the hours stay meaningful
	const viewedDate = createMemo<CalendarDate>(
		() => parsedDate() ?? todayBerlin(),
	)
	const info = createMemo(() => openingInfo(props.openingDays, viewedDate()))
	const hasData = createMemo(() => (props.openingDays?.length ?? 0) > 0)
	const summary = createMemo(() => formatHeaderSummary(info(), viewedDate()))
	const serviceRange = createMemo(() => {
		const day = info().day
		return day ? formatServiceRange(day) : null
	})

	function goToDate(options: { offset?: number }) {
		const { offset } = options
		if (!offset) return
		// Fall back to today so the arrows also work from an unparsable URL
		const base = parsedDate() ?? todayBerlin()
		const nextDateString = formatRouteDate(addDays(base, offset))
		navigate(`/${params.provider}/${params.mensa}/${nextDateString}`, {
			replace: true,
		})
	}

	function getDateString(date: CalendarDate | null) {
		// Unknown date format: show it as it came in instead of guessing
		if (!date) return params.date

		const today = todayBerlin()
		// Check if its within the same calendar week
		if (isSameWeek(today, date)) {
			// Check if its today
			if (isSameDay(today, date)) return "Heute"
			return formatWeekday(date)
		}
		return formatDisplayDate(date)
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
				<div class="flex justify-between items-end gap-2 flex-wrap">
					{/* Opening Times */}
					<Show when={hasData()}>
						<div class="flex items-center gap-1">
							<div
								class={
									"h-fit rounded-[4px] px-2 py-1 inline-block font-noto text-[12px] font-semibold " +
									(info().status === "closed"
										? "bg-[##DDEDE2] text-[#494835]"
										: "bg-[#DDEDE2] text-[#494835] border-black/10 border")
								}>
								{summary()}
							</div>
							<Show when={serviceRange()}>
								<div class="h-fit text-[#494835] inline-block font-noto text-[12px] font-semibold">
									{serviceRange()}
								</div>
							</Show>
						</div>
					</Show>

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
