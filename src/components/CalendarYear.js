import React from "react"
import { format, isSameMonth, isSameDay, isBefore, getYear } from "date-fns"

import {
	initializeYear,
	getNextMonday,
	arrayOfDateFromEvents,
	getArrayOfEvents,
} from "../utils/utils"

function CalendarYear({
	selectedDate,
	setSelectedDate,
	handleOpenEvent,
	handleOpenEventViewAll,
	events,
}) {
	const months = initializeYear(selectedDate)
	return (
		<div className='display-year-container'>
			{months.map(month => (
				<div
					className='display-year-bloc'
					key={format(new Date(month[10]), "T")}>
					<div className='display-year-title'>
						<p>{format(new Date(month[10]), "MMMM")}</p>
					</div>
					<div className='display-year'>
						{month.map(day => (
							<div
								key={format(day, "t")}
								className={
									isBefore(
										day,
										getNextMonday(
											new Date(
												`1 ${format(new Date(month[10]), "MMMM")} 
														${getYear(selectedDate)}`,
											),
										),
									)
										? "week-name"
										: "hide"
								}>
								{format(day, "eeeee")}
							</div>
						))}
						{month.map(day => (
							<div
								key={format(day, "T")}
								onClick={() => setSelectedDate(new Date(day))}
								className={
									!isSameMonth(day, month[10]) && isSameDay(day, selectedDate)
										? "display-year-day display-year-non-month-day-active"
										: !isSameMonth(day, month[10])
										? "display-year-day display-year-non-month-day"
										: "display-year-day"
								}>
								<div className='day-header'>
									<div
										className={
											!isSameDay(day, selectedDate)
												? "display-year-day-number"
												: isSameDay(day, selectedDate) &&
												  !isSameMonth(day, month[10])
												? "display-year-non-month-day-active"
												: "display-year-day-number active"
										}>
										{arrayOfDateFromEvents(events, day).includes(
											day.toString().slice(0, 15),
										) ? (
											<div
												className='event-day'
												onClick={() =>
													handleOpenEventViewAll(getArrayOfEvents(events, day))
												}>
												{format(day, "dd")}
											</div>
										) : (
											<>{format(day, "dd")}</>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}

export default CalendarYear
