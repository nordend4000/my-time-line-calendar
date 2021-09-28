import React, { useState } from "react"
import ReactDom from "react-dom"
import { format, compareAsc } from "date-fns"
import { MODAL_STYLES, OVERLAY_STYLES } from "../utils/modalStyles"

export default function ModalEventForm({
	open,
	onClose,
	selectedDate,
	addEvent,
	setName,
	setAllDay,
	setEventColor,
	setBlue,
	setGreen,
	setRed,
	setStartTime,
	setEndTime,
	submitForm,
	event,
	deleteEvent,
	events,
	allDayChecked,
	setAllDayChecked,
	setMultipleDay,
	setFinishDay,
	startTime,
	repeat,
	setRepeat,
	reminder,
	setReminder,
	setEditAll,
	clearStates,
	allDay,
}) {
	const [multipleDayChecked, setMultipleDayChecked] = useState(false)
	const [disable, setDisable] = useState(false)
	const [error, setError] = useState(false)

	if (!open) return null

	function handleFinishDate(e) {
		let start
		if (event) start = event.date
		else start = selectedDate
		if (compareAsc(new Date(e), new Date(start)) !== 1) {
			setDisable(true)
			return setError("Finish date is unvalid should be after event day")
		}
		setError("")
		setDisable(false)
		setFinishDay(e)
	}

	function handleAllDay(e) {
		if (e) {
			setAllDayChecked(true)
			setStartTime("")
			setEndTime("")
		} else {
			setAllDayChecked(false)
		}
		setAllDay(e)
	}
	function handleMultipleDay(e) {
		if (e) {
			setMultipleDayChecked(true)
			setDisable(true)
			setError("Please select a finish date")
		} else {
			setMultipleDayChecked(false)
			setDisable(false)
			setError("")
		}
		setMultipleDay(e)
	}
	function handleCheckBoxColor(color) {
		if (color === "red") {
			setRed(true)
			setGreen(false)
			setBlue(false)
			setEventColor("red")
		}
		if (color === "blue") {
			setBlue(true)
			setGreen(false)
			setRed(false)
			setEventColor("blue")
		}
		if (color === "green") {
			setGreen(true)
			setBlue(false)
			setRed(false)
			setEventColor("green")
		}
	}
	function handleSubmit(e, addOrEdit) {
		submitForm(e, addOrEdit)
		setMultipleDayChecked(false)
		setError("")
	}
	function handleClose() {
		setMultipleDayChecked(false)
		clearStates()
		onClose()
		setError("")
	}
	return ReactDom.createPortal(
		<>
			<div style={OVERLAY_STYLES} onClick={() => handleClose()} />
			<div style={MODAL_STYLES}>
				<button className='modal-close-btn' onClick={() => handleClose()}>
					X
				</button>
				<div>
					<div className='modal-title'>
						<div>{addEvent ? "Add Event" : "Edit Event"}</div>
						<small>
							{!event
								? format(selectedDate, "PP")
								: format(new Date(event.date), "PP")}
						</small>
					</div>
					<form
						onSubmit={
							!event
								? e => handleSubmit(e, "add")
								: e => handleSubmit(e, "edit")
						}>
						<div className='form-group'>
							<label htmlFor='name'>Name</label>
							<input
								type='text'
								name='name'
								id='name'
								onChange={e => setName(e.target.value)}
								defaultValue={!event ? "" : event.name}
							/>
						</div>
						<div className='form-group checkbox'>
							<input
								type='checkbox'
								name='all-day'
								id='all-day'
								onChange={e => handleAllDay(e.target.checked)}
								defaultChecked={!event ? allDay : event.allDay}
							/>
							<label htmlFor='all-day'>
								<small>All Day</small>
							</label>
						</div>
						<div className='form-group checkbox'>
							<input
								type='checkbox'
								name='multiple-day'
								id='multiple-day'
								onChange={e => handleMultipleDay(e.target.checked)}
								defaultChecked={!event ? "" : event.multipleDay}
							/>
							<label htmlFor='multiple-day'>
								<small>Multiple Day</small>
							</label>
						</div>
						{(multipleDayChecked || event.multipleDay) && (
							<div className='form-group'>
								<label htmlFor='finish-date'>Finish Date</label>
								<input
									type='date'
									name='finish-date'
									id='finish-date'
									onChange={e => handleFinishDate(e.target.value)}
									defaultValue={
										!event
											? ""
											: format(new Date(event.finishDay), "yyyy-MM-dd")
									}
								/>
							</div>
						)}
						{error && <div className='error-red'>{error}</div>}
						<div className='row'>
							<div className='form-group'>
								<label htmlFor='start-time'>Start Time</label>
								<input
									type='time'
									name='start-time'
									id='start-time'
									onChange={e => setStartTime(e.target.value)}
									defaultValue={!event ? startTime : event.startTime}
									disabled={allDayChecked ? true : false}
								/>
							</div>
							<div className='form-group'>
								<label htmlFor='end-time'>End Time</label>
								<input
									type='time'
									name='end-time'
									id='end-time'
									onChange={e => setEndTime(e.target.value)}
									defaultValue={!event ? "" : event.endTime}
									disabled={allDayChecked ? true : false}
								/>
							</div>
						</div>
						<div className='form-group'>
							<label>Color</label>
							<div className='row left'>
								<input
									type='radio'
									name='color'
									value='blue'
									id='blue'
									className='color-radio'
									data-color
									onChange={e => handleCheckBoxColor(e.target.value)}
									defaultChecked={!event ? "" : event.blue}
								/>
								<label htmlFor='blue'>
									<span className='sr-only'>Blue</span>
								</label>
								<input
									type='radio'
									name='color'
									value='red'
									id='red'
									className='color-radio'
									data-color
									onChange={e => handleCheckBoxColor(e.target.value)}
									defaultChecked={!event ? "" : event.red}
								/>
								<label htmlFor='red'>
									<span className='sr-only'>Red</span>
								</label>
								<input
									type='radio'
									name='color'
									value='green'
									id='green'
									className='color-radio'
									data-color
									onChange={e => handleCheckBoxColor(e.target.value)}
									defaultChecked={!event ? "" : event.green}
								/>
								<label htmlFor='green'>
									<span className='sr-only'>Green</span>
								</label>
							</div>
						</div>
						<div className='form-group'>
							<label htmlFor='repeat'>Repeat</label>
							<select
								className='btn btn-header'
								name='repeat'
								value={repeat}
								onChange={e => setRepeat(e.target.value)}>
								<option value='one-time'>One time</option>
								<option value='every-week'>Every Week</option>
								<option value='every-month'>Every Month</option>
								<option value='every-year'>Every Year</option>
							</select>
						</div>
						<div className='form-group'>
							<label htmlFor='reminder'>Reminder</label>
							<select
								className='btn btn-header'
								name='reminder'
								value={reminder}
								onChange={e => setReminder(e.target.value)}>
								<option value='no-reminder'>No reminder</option>
								<option value='day-before'>1 Day Before</option>
								<option value='hour-before'>1 Hour Before</option>
								<option value='minute-before'>10 minutes Before</option>
								<option value='week-before'>1 Week Before</option>
							</select>
						</div>
						{event && (
							<div className='form-group checkbox'>
								<input
									type='checkbox'
									name='edit-all'
									id='edit-all'
									onChange={e => setEditAll(e.target.checked)}
									defaultChecked={!event ? "" : event.editAll}
								/>
								<label htmlFor='edit-all'>
									<small>Update All Events / Delete All Events</small>
								</label>
							</div>
						)}
						<div className='row'>
							<button
								className='btn btn-success'
								type='submit'
								disabled={disable}>
								{addEvent ? "Add" : "Update"}
							</button>
							<button
								className='btn btn-delete'
								type='button'
								onClick={
									!event
										? () => handleClose()
										: () => deleteEvent(event, events)
								}>
								{addEvent ? "Cancel" : "Delete"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>,
		document.getElementById("modal"),
	)
}
