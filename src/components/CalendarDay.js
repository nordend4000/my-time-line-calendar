import React from "react"
import Events from "./Events"
import { createArrayOfHours } from "../utils/utils"
import { format } from "date-fns"

function CalendarDay({
	selectedDate,
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
	const day = new Date(`${selectedDate.toString().slice(0, 15)} 00:00:00`)
	const hours = createArrayOfHours(selectedDate)
	return (
		<>
			<div className='title-week-name'>
				<h3 className='typo'>{format(selectedDate, "EEEE")}</h3>
			</div>
			<span
				className='add-all-day-event'
				onClick={() => handleOpenEvent("addallday")}>
				+ All day Event
			</span>
			<div className='display-day-container'>
				<div className='display-day'>
					<Events
						events={events.filter(
							event =>
								event.allDay === true ||
								(event.allDay === false && event.startTime === ""),
						)}
						handleOpenEvent={handleOpenEvent}
						onDragStart={onDragStart}
						day={day}
						handleOpenEventViewAll={handleOpenEventViewAll}
						redFilter={redFilter}
						blueFilter={blueFilter}
						greenFilter={greenFilter}
					/>
					<div>
						{hours.map(hour => (
							<div className='hours-container' key={`key-${hour}`}>
								<span className='hours'>{hour}</span>
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
			</div>
		</>
	)
}

export default CalendarDay
