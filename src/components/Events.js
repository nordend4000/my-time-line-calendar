import React from "react"
import { format } from "date-fns"
import { getArrayOfEvents, filterMultipleDate } from "../utils/utils"

function Events({
	events,
	handleOpenEvent,
	onDragStart,
	handleOpenEventViewAll,
	day,
	redFilter,
	blueFilter,
	greenFilter,
}) {
	return (
		<div className='events'>
			{events.map(
				event =>
					(filterMultipleDate(event, day) ||
						format(day, "T") === event.timestamp) && (
						<div
							key={event.eventId}
							className={
								event.red && !redFilter
									? "hide"
									: event.blue && !blueFilter
									? "hide"
									: event.green && !greenFilter
									? "hide"
									: ""
							}>
							<button
								className={
									getArrayOfEvents(events, day).length <= 3
										? event.allDay
											? `all-day-event ${event.eventColor} event`
											: "event"
										: "hide"
								}
								onClick={() => handleOpenEvent(event)}
								draggable
								onDragStart={e => onDragStart(e, event)}>
								<div
									className={
										event.allDay ? "" : `color-dot ${event.eventColor}`
									}></div>
								<div className='event-time'>
									{event.startTime && !event.multipleDay
										? event.startTime
										: event.multipleDates.length > 0 &&
										  event.multipleDates[0].toString() === day.toString()
										? event.startTime
										: ""}
								</div>
								<div className='event-name'>{event.name}</div>
								<div className='event-time'>
									{event.endTime && !event.multipleDay
										? ""
										: event.finishDay !== "" &&
										  new Date(event.finishDay).toString().substring(0, 15) ===
												day.toString().substring(0, 15)
										? event.endTime
										: ""}
								</div>
							</button>
						</div>
					),
			)}
			{getArrayOfEvents(events, day).length > 3
				? events.slice(0, 3).map(event =>
						format(day, "T") === event.timestamp ? (
							<button
								key={event.eventId}
								className={
									event.allDay
										? `all-day-event ${event.eventColor} event`
										: "event"
								}
								onClick={() => handleOpenEvent(event)}>
								<div
									className={
										event.allDay ? "" : `color-dot ${event.eventColor}`
									}></div>
								<div className='event-time'>{event.startTime}</div>
								<div className='event-name'>{event.name}</div>
							</button>
						) : (
							""
						),
				  )
				: ""}
			{getArrayOfEvents(events, day).length > 3 ? (
				<button
					className='events-view-more-btn'
					onClick={() => handleOpenEventViewAll(getArrayOfEvents(events, day))}>
					{`+ ${getArrayOfEvents(events, day).length - 3} More`}
				</button>
			) : (
				""
			)}
		</div>
	)
}

export default Events
