import React from "react"
import { format, isSameMonth, isSameDay } from "date-fns"
import Events from "./Events"
import { initializeWeek, createArrayOfHours } from "../utils/utils"

function CalendarWeek({
	selectedDate,
	setSelectedDate,
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
	const dates = initializeWeek(selectedDate)
	const hours = createArrayOfHours(selectedDate)

	return (
		<div className='days'>
			{dates.map(day => (
				<div
					key={format(day, "T")}
					onClick={() => setSelectedDate(new Date(day))}
					className={
						!isSameMonth(day, selectedDate)
							? "day non-month-day-display-week"
							: "day"
					}
					onDragOver={e => onDragOver(e)}
					onDrop={e => onDrop(e, day)}>
					<div className='day-header'>
						<div className='week-name'>{format(day, "E")}</div>
						<div
							className={
								!isSameDay(day, selectedDate)
									? "day-number"
									: "day-number active"
							}>
							{format(day, "dd")}
						</div>
					</div>
					<Events
						events={events.filter(
							event =>
								event.allDay === true ||
								(event.allDay === false && event.startTime === ""),
						)}
						handleOpenEvent={handleOpenEvent}
						onDragStart={onDragStart}
						handleOpenEventViewAll={handleOpenEventViewAll}
						day={day}
						redFilter={redFilter}
						blueFilter={blueFilter}
						greenFilter={greenFilter}
					/>
					<div>
						{hours.map(hour => (
							<div className='hours-container' key={`key-week-${hour}`}>
								<span className='hours'>{hour} </span>
								<span
									className='add-event-display-day'
									onClick={() => handleOpenEvent("addwithhour", hour)}>
									+
								</span>
								<Events
									events={events.filter(
										event =>
											event.allDay === false &&
											event.startTime.slice(0, 2) === hour.slice(0, 2),
									)}
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
				</div>
			))}
		</div>
	)
}

export default CalendarWeek
