import React, { useState, useEffect } from "react"
import "./styles/App.css"
import Header from "./components/Header"
import CalendarMonth from "./components/CalendarMonth"
import CalendarDay from "./components/CalendarDay"
import CalendarWeek from "./components/CalendarWeek"
import CalendarYear from "./components/CalendarYear"
import LeftSide from "./components/LeftSide"
import ModalEventForm from "./components/ModalEventForm"
import ModalEventViewAll from "./components/ModalEventViewAll"
import { v4 as uuidV4 } from "uuid"
import Axios from "axios"
import { initializeMonth } from "./utils/utils"
import {
	format,
	eachDayOfInterval,
	isValid,
	addDays,
	addYears,
	addWeeks,
	addMonths,
	subDays,
	subMinutes,
	subHours,
	subWeeks,
	addHours,
	addMinutes,
} from "date-fns"

function App() {
	const [displayCalendar, setDisplayCalendar] = useState("month")
	const [selectedDate, setSelectedDate] = useState(
		new Date(`${new Date().toString().slice(0, 15)} 00:00:00`),
	)
	const [openLeft, setOpenLeft] = useState(true)
	const [openEventViewAll, setOpenEventViewAll] = useState(false)
	const [openEventForm, setOpenEventForm] = useState(false)
	const [addEvent, setAddEvent] = useState(false)
	const [name, setName] = useState("")
	const [allDay, setAllDay] = useState(false)
	const [eventColor, setEventColor] = useState("blue")
	const [blue, setBlue] = useState(false)
	const [red, setRed] = useState(false)
	const [green, setGreen] = useState(false)
	const [startTime, setStartTime] = useState("")
	const [endTime, setEndTime] = useState("")
	const [events, setEvents] = useState([])
	const [event, setEvent] = useState("")
	const [allDayChecked, setAllDayChecked] = useState(false)
	const [multipleDay, setMultipleDay] = useState(false)
	const [finishDay, setFinishDay] = useState("")
	const [blueFilter, setBlueFilter] = useState(true)
	const [greenFilter, setGreenFilter] = useState(true)
	const [redFilter, setRedFilter] = useState(true)
	const [repeat, setRepeat] = useState("one-time")
	const [reminder, setReminder] = useState("no-reminder")
	const [editAll, setEditAll] = useState(false)
	const [count, setCount] = useState(0)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setLoading(true)
		getEvents()
	}, [count])

	const dates = initializeMonth(selectedDate)

	function handleOpenEventViewAll(arr) {
		setOpenEventViewAll(true)
		setEvent(arr)
	}
	function handleEditEventFromViewAll(element) {
		setEvent("")
		setOpenEventViewAll(false)
		setOpenEventForm(true)
		initializeStates(element)
	}
	function handleOpenEvent(event, hour) {
		setEvent("")
		setOpenEventForm(true)
		if (event === "addwithhour") {
			setStartTime(`${hour.slice(0, 2)}:00`)
			setAddEvent(true)
			return
		}
		if (event === "addallday") {
			setAllDay(true)
			setAddEvent(true)
			setAllDayChecked(true)
			return
		}
		if (event === "add") {
			setAddEvent(true)
			return
		}
		initializeStates(event)
		return
	}
	function submitForm(e, type) {
		e.preventDefault()
		const idRepeat = uuidV4()
		if (type === "add" && repeat !== "one-time") {
			addRepeatedEvent(repeat, idRepeat)
			return
		}
		let multipleDates = []
		if (isValid(new Date(finishDay))) {
			if (multipleDay) {
				multipleDates = eachDayOfInterval({
					start: new Date(`${selectedDate}`),
					end: new Date(`${finishDay}`),
				})
			}
		}
		if (type === "add") {
			const eventToCreate = {
				name,
				allDay,
				startTime,
				endTime,
				eventColor,
				red,
				green,
				blue,
				finishDay:
					finishDay !== "" && isValid(new Date(finishDay))
						? new Date(finishDay).toString().substring(0, 15)
						: "",
				multipleDay,
				multipleDates,
				repeat,
				reminder,
				editAll,
				timestamp: format(selectedDate, "T"),
				date: selectedDate.toString().substring(0, 15),
				eventId: uuidV4(),
				repeatId: idRepeat,
			}
			if (reminder !== "no-reminder") postReminder(eventToCreate)
			postEvent(eventToCreate)
		}
		if (type === "edit") {
			if (multipleDay && event.finishDay !== finishDay) {
				multipleDates = eachDayOfInterval({
					start: new Date(`${selectedDate}`),
					end: new Date(`${finishDay}`),
				})
			}
			if (multipleDay && event.finishDay === finishDay) {
				multipleDates = event.multipleDates
			}
			if (repeat !== "one-time" && editAll) {
				deleteAll(event.repeatId)
				addRepeatedEvent(repeat, idRepeat)
			} else {
				const updatedEvent = {
					name: name,
					allDay: allDay,
					startTime: startTime,
					endTime: endTime,
					eventColor: eventColor,
					red: red,
					green: green,
					blue: blue,
					finishDay:
						finishDay !== "1970-01-01T00:00:00.000Z" &&
						isValid(new Date(finishDay))
							? new Date(finishDay).toString().substring(0, 15)
							: "",
					multipleDay: multipleDay,
					multipleDates: multipleDates,
					repeat: repeat,
					reminder: reminder,
					editAll: editAll,
					timestamp: event.timestamp,
					date: event.date,
					eventId: event.eventId,
					repeatId: event.repeatId,
				}
				if (reminder !== "no-reminder") postReminder(updatedEvent)
				putEvent(event.eventId, updatedEvent)
			}
		}
		clearStates()
	}
	function deleteEvent(eventToDelete) {
		if (editAll) {
			deleteAll(eventToDelete.repeatId)
		} else {
			deleteSingle(eventToDelete.eventId)
		}
		clearStates()
	}
	function initializeStates(element) {
		let finishDate
		if (element.finishDay === null) finishDate = ""
		else {
			finishDate = new Date(element.finishDay)
		}
		if (element.allDay) setAllDayChecked(true)
		setAllDay(element.allDay)
		setEvent({
			...element,
			finishDay: new Date(`${finishDate}`).toString(),
			date: new Date(`${element.date}`).toString(),
		})
		setName(element.name)
		setEventColor(element.eventColor)
		setBlue(element.blue)
		setGreen(element.green)
		setRed(element.red)
		setStartTime(element.startTime)
		setEndTime(element.endTime)
		setMultipleDay(element.multipleDay)
		setFinishDay(finishDate.toString())
		setRepeat(element.repeat)
		setReminder(element.reminder)
		setEditAll(element.editAll)
	}
	function clearStates() {
		setName("")
		setAllDay(false)
		setEventColor("blue")
		setStartTime("")
		setEndTime("")
		setBlue(false)
		setRed(false)
		setGreen(false)
		setOpenEventForm(false)
		setAddEvent(false)
		setEvent("")
		setAllDayChecked(false)
		setMultipleDay(false)
		setFinishDay("")
		setRepeat("one-time")
		setReminder("no-reminder")
		setEditAll(false)
	}
	function onDragOver(e) {
		e.preventDefault()
	}
	function onDragStart(e, event) {
		initializeStates(event)
	}
	function onDrop(e, day) {
		let nbOfDays = 0
		let finishDate = ""
		let multipleDates = []
		let newTimestamp = format(day, "T")
		if (event.multipleDay) {
			nbOfDays = event.multipleDates.length - 1
			finishDate = addDays(day, nbOfDays)
			multipleDates = eachDayOfInterval({
				start: day,
				end: finishDate,
			})
		}
		if (event.repeat !== "one-time") {
			if (
				window.confirm("Do you want to drag all repeated events ?") === true
			) {
				deleteAll(event.repeatId)
				editDroppedRepeated(day)
				clearStates()
				return
			}
		}
		const droppedEvent = {
			name: event.name,
			allDay: event.allDay,
			startTime: event.startTime,
			endTime: event.endTime,
			eventColor: event.eventColor,
			red: event.red,
			green: event.green,
			blue: event.blue,
			finishDay: finishDate.toString().substring(0, 15),
			multipleDay: event.multipleDay,
			multipleDates: multipleDates,
			repeat: event.repeat,
			reminder: event.reminder,
			timestamp: newTimestamp,
			date: day.toString().substring(0, 15),
			eventId: event.eventId,
			repeatId: event.repeatId,
		}
		putEvent(event.eventId, droppedEvent)
		clearStates()
		return
	}
	function editDroppedRepeated(day) {
		let date = day
		let nbOfDays = 0
		let finishDate = ""
		let multipleDates = []
		if (event.multipleDay) {
			nbOfDays = event.multipleDates.length - 1
			finishDate = addDays(day, nbOfDays)
			multipleDates = eachDayOfInterval({
				start: day,
				end: finishDate,
			})
		}
		let name = event.name
		let allDay = event.allDay
		let startTime = event.startTime
		let endTime = event.endTime
		let eventColor = event.eventColor
		let red = event.red
		let green = event.green
		let blue = event.blue
		let multipleDay = event.multipleDay
		let repeat = event.repeat
		let reminder = event.reminde
		let editAll = event.editAll
		let repeatId = event.repeatId
		let count = 0
		if (event.repeat === "one-time") return
		if (event.repeat === "every-week") count = 250
		if (event.repeat === "every-month") count = 100
		if (event.repeat === "every-year") count = 10
		while (count > 0) {
			const changesRepeated = {
				name: name,
				allDay: allDay,
				startTime: startTime,
				endTime: endTime,
				eventColor: eventColor,
				red: red,
				green: green,
				blue: blue,
				finishDay:
					finishDate !== "" ? finishDate.toString().substring(0, 15) : "",
				multipleDay: multipleDay,
				multipleDates: multipleDates,
				repeat: repeat,
				reminder: reminder,
				editAll: editAll,
				timestamp: format(date, "T"),
				date: date.toString().substring(0, 15),
				eventId: uuidV4(),
				repeatId: repeatId,
			}
			postEvent(changesRepeated)
			if (event.repeat === "every-week") date = addWeeks(date, 1)
			if (event.repeat === "every-month") date = addMonths(date, 1)
			if (event.repeat === "every-year") date = addYears(date, 1)
			if (event.multipleDay && isValid(finishDate)) {
				finishDate = addDays(date, event.multipleDates.length - 1)
				multipleDates = eachDayOfInterval({
					start: date,
					end: finishDate,
				})
			}
			count--
		}
		setCount(count + 1)
	}
	function addRepeatedEvent(repeat, id) {
		let multipleDates = []
		if (multipleDay) {
			multipleDates = eachDayOfInterval({
				start: new Date(`${selectedDate}`),
				end: new Date(`${finishDay}`),
			})
		}
		let date = selectedDate
		let finishDate = new Date(`${finishDay}`)
		let count = 0
		if (repeat === "one-time") return
		if (repeat === "every-week") count = 250
		if (repeat === "every-month") count = 100
		if (repeat === "every-year") count = 10
		while (count > 0) {
			const repeatedEvent = {
				name,
				allDay,
				startTime,
				endTime,
				eventColor,
				red,
				green,
				blue,
				finishDay: finishDate,
				multipleDay,
				multipleDates,
				repeat,
				reminder,
				timestamp: format(date, "T"),
				date: new Date(date).toString().substring(0, 15),
				eventId: uuidV4(),
				repeatId: id,
			}
			if (reminder !== "no-reminder") postReminder(repeatedEvent)
			postEvent(repeatedEvent)
			if (repeat === "every-week") date = addWeeks(date, 1)
			if (repeat === "every-month") date = addMonths(date, 1)
			if (repeat === "every-year") date = addYears(date, 1)
			if (multipleDay) {
				finishDate = addDays(new Date(`${date}`), multipleDates.length - 1)
				multipleDates = eachDayOfInterval({
					start: new Date(`${date}`),
					end: new Date(`${finishDate}`),
				})
			}
			count--
		}
		setCount(count + 1)
		clearStates()
	}
	async function postEvent(eventToCreate) {
		await Axios.post(
			`${process.env.REACT_APP_DATABASE_URL}/create`,
			eventToCreate,
		).then(() => {
			setCount(count + 1)
		})
	}
	async function putEvent(eventId, updatedEvent) {
		await Axios.put(
			`${process.env.REACT_APP_DATABASE_URL}/edit/${eventId}`,
			updatedEvent,
		).then(() => {
			setCount(count + 1)
		})
	}
	async function getEvents() {
		await Axios.get(`${process.env.REACT_APP_DATABASE_URL}/my-events`).then(
			response => {
				setEvents(response.data)
				setLoading(false)
			},
		)
	}
	async function deleteAll(repeatId) {
		await Axios.delete(
			`${process.env.REACT_APP_DATABASE_URL}/delete-repeated/${repeatId}`,
		).then(() => {
			setCount(count + 1)
		})
	}
	async function deleteSingle(eventId) {
		await Axios.delete(
			`${process.env.REACT_APP_DATABASE_URL}/delete/${eventId}`,
		).then(() => {
			setCount(count + 1)
		})
	}
	function postReminder(event) {
		let reminderDate = new Date(event.date)
		if (event.startTime) {
			const hour = parseInt(event.startTime.substring(0, 2))
			const minute = parseInt(event.startTime.substring(3, 5))
			reminderDate = addHours(reminderDate, hour)
			reminderDate = addMinutes(reminderDate, minute)
		}
		if (event.reminder === "day-before") {
			reminderDate = subDays(reminderDate, 1)
		}
		if (event.reminder === "hour-before") {
			reminderDate = subHours(reminderDate, 1)
		}
		if (event.reminder === "minute-before") {
			reminderDate = subMinutes(reminderDate, 10)
		}
		if (event.reminder === "week-before") {
			reminderDate = subWeeks(reminderDate, 1)
		}
		const reminderToSend = {
			name: event.name,
			allDay: event.allDay,
			startTime: event.startTime,
			endTime: event.endTime,
			finishDay: event.finishDay,
			repeat: event.repeat,
			date: event.date,
			minute: format(reminderDate, "m"),
			hour: format(reminderDate, "HH"),
			day: format(reminderDate, "d"),
			month: format(reminderDate, "MMMM"),
		}
		Axios.post(`${process.env.REACT_APP_DATABASE_URL}/reminder`, reminderToSend)
	}

	return (
		<div className='App'>
			<Header
				selectedDate={selectedDate}
				setSelectedDate={setSelectedDate}
				openLeft={openLeft}
				setOpenLeft={setOpenLeft}
				handleOpenEvent={handleOpenEvent}
				setDisplayCalendar={setDisplayCalendar}
				displayCalendar={displayCalendar}
			/>
			<div className='shared'>
				{openLeft ? (
					<LeftSide
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						handleOpenEvent={handleOpenEvent}
						dates={dates}
						redFilter={redFilter}
						blueFilter={blueFilter}
						greenFilter={greenFilter}
						setRedFilter={setRedFilter}
						setBlueFilter={setBlueFilter}
						setGreenFilter={setGreenFilter}
					/>
				) : (
					""
				)}
				{loading ? (
					<div className='loading'>
						<img
							alt='loading bar'
							src={process.env.PUBLIC_URL + `/loading.svg`}
						/>
					</div>
				) : (
					<div className='calendar'>
						{displayCalendar === "year" ? (
							<CalendarYear
								displayCalendar={displayCalendar}
								selectedDate={selectedDate}
								setSelectedDate={setSelectedDate}
								dates={dates}
								handleOpenEvent={handleOpenEvent}
								handleOpenEventViewAll={handleOpenEventViewAll}
								onDragOver={onDragOver}
								onDragStart={onDragStart}
								onDrop={onDrop}
								events={events}
							/>
						) : displayCalendar === "day" ? (
							<CalendarDay
								displayCalendar={displayCalendar}
								selectedDate={selectedDate}
								handleOpenEvent={handleOpenEvent}
								handleOpenEventViewAll={handleOpenEventViewAll}
								onDragOver={onDragOver}
								onDragStart={onDragStart}
								onDrop={onDrop}
								events={events}
								redFilter={redFilter}
								blueFilter={blueFilter}
								greenFilter={greenFilter}
							/>
						) : displayCalendar === "week" ? (
							<CalendarWeek
								displayCalendar={displayCalendar}
								selectedDate={selectedDate}
								setSelectedDate={setSelectedDate}
								handleOpenEvent={handleOpenEvent}
								handleOpenEventViewAll={handleOpenEventViewAll}
								onDragOver={onDragOver}
								onDragStart={onDragStart}
								onDrop={onDrop}
								events={events}
								redFilter={redFilter}
								blueFilter={blueFilter}
								greenFilter={greenFilter}
							/>
						) : (
							<CalendarMonth
								displayCalendar={displayCalendar}
								selectedDate={selectedDate}
								setSelectedDate={setSelectedDate}
								handleOpenEvent={handleOpenEvent}
								handleOpenEventViewAll={handleOpenEventViewAll}
								onDragOver={onDragOver}
								onDragStart={onDragStart}
								onDrop={onDrop}
								events={events}
								dates={dates}
								redFilter={redFilter}
								blueFilter={blueFilter}
								greenFilter={greenFilter}
							/>
						)}
					</div>
				)}
			</div>
			<ModalEventForm
				open={openEventForm}
				onClose={() => setOpenEventForm(false)}
				selectedDate={selectedDate}
				addEvent={addEvent}
				setName={setName}
				setAllDay={setAllDay}
				setEventColor={setEventColor}
				setGreen={setGreen}
				setBlue={setBlue}
				setRed={setRed}
				setStartTime={setStartTime}
				setEndTime={setEndTime}
				submitForm={submitForm}
				event={event}
				events={events}
				deleteEvent={deleteEvent}
				allDayChecked={allDayChecked}
				setAllDayChecked={setAllDayChecked}
				setMultipleDay={setMultipleDay}
				setFinishDay={setFinishDay}
				startTime={startTime}
				repeat={repeat}
				setRepeat={setRepeat}
				reminder={reminder}
				setReminder={setReminder}
				setEditAll={setEditAll}
				clearStates={clearStates}
				allDay={allDay}
			/>
			<ModalEventViewAll
				open={openEventViewAll}
				onClose={() => setOpenEventViewAll(false)}
				selectedDate={selectedDate}
				event={event}
				handleEditEventFromViewAll={handleEditEventFromViewAll}
			/>
		</div>
	)
}

export default App
