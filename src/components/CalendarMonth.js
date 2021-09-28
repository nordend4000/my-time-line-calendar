import React from "react"
import { format, isSameMonth, isSameDay, isBefore } from "date-fns"
import Events from "./Events"
import { getNextMonday } from "../utils/utils"

function CalendarMonth({
	selectedDate,
	setSelectedDate,
	dates,
	onDragOver,
	onDrop,
	onDragStart,
	handleOpenEvent,
	handleOpenEventViewAll,
	events,
	redFilter,
	blueFilter,
	greenFilter,
}) {
	return (
		<>
			<div className='days'>
				{dates.map(day => (
					<div
						key={format(day, "T")}
						onClick={() => setSelectedDate(new Date(day))}
						className={
							!isSameMonth(day, selectedDate) ? "day non-month-day" : "day"
						}
						onDragOver={e => onDragOver(e)}
						onDrop={e => onDrop(e, day)}>
						<div className='day-header'>
							<div
								className={
									isBefore(day, getNextMonday(selectedDate))
										? "week-name"
										: "hide"
								}>
								{format(day, "E")}
							</div>
							<div
								className={
									!isSameDay(day, selectedDate)
										? "day-number"
										: "day-number active"
								}>
								{format(day, "dd")}
							</div>
							<button
								className='add-event-btn'
								onClick={() => handleOpenEvent("add")}>
								+
							</button>
						</div>
						<Events
							events={events}
							handleOpenEvent={handleOpenEvent}
							onDragStart={onDragStart}
							handleOpenEventViewAll={handleOpenEventViewAll}
							day={day}
							redFilter={redFilter}
							blueFilter={blueFilter}
							greenFilter={greenFilter}
						/>
					</div>
				))}
			</div>
		</>
	)
}

export default CalendarMonth
