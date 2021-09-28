import React from "react"
import ReactDom from "react-dom"
import { MODAL_STYLES, OVERLAY_STYLES } from "../utils/modalStyles"

export default function ModalInfo({ open, onClose }) {
	if (!open) return null

	return ReactDom.createPortal(
		<>
			<div style={OVERLAY_STYLES} onClick={onClose} />
			<div style={MODAL_STYLES}>
				<button className='modal-close-btn' onClick={onClose}>
					X
				</button>
				<div id='view-all-events-template' className='modal-bis'>
					<div className='modal-title'>Info :</div>
					<p className='info'>- Click the + to add a new event</p>
					<p className='info'>- Click on the event itself to edit or delete</p>
					<p className='info'>- Drag & Drop the event to change the date</p>
					<p className='info'>
						- Choose you calendar display : Month, Week, Day, Year
					</p>
				</div>
			</div>
		</>,
		document.getElementById("modal"),
	)
}
