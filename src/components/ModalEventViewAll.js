import React from "react"
import ReactDom from "react-dom"
import { format } from "date-fns"
import { MODAL_STYLES, OVERLAY_STYLES } from "../utils/modalStyles"

export default function ModalEventViewAll({
	open,
	onClose,
	selectedDate,
	event,
	handleEditEventFromViewAll,
}) {
	if (!open) return null

	return ReactDom.createPortal(
		<>
			<div style={OVERLAY_STYLES} onClick={onClose} />
			<div style={MODAL_STYLES}>
				<button className='modal-close-btn' onClick={onClose}>
					X
				</button>
				<div id='view-all-events-template' className='modal-bis'>
					<div className='modal-title'>{format(selectedDate, "PP")}</div>

					{event.map(el => (
						<button
							key={el.eventId}
							onClick={() => handleEditEventFromViewAll(el)}
							className={
								el.allDay ? `all-day-event ${el.eventColor} event` : "event"
							}>
							<div
								className={el.allDay ? "" : `color-dot ${el.eventColor}`}></div>
							<div className='event-time'>{el.startName}</div>
							<div className='event-name'>{el.name}</div>
						</button>
					))}
				</div>
			</div>
		</>,
		document.getElementById("modal"),
	)
}
