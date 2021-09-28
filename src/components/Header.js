import React, { useState, useEffect } from "react"
import { format, addMonths, addWeeks, addYears, addDays } from "date-fns"
import ModalInfo from "./ModalInfo"
import { BsArrowBarLeft } from "react-icons/bs"
import { BsArrowBarRight } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { IoIosArrowForward } from "react-icons/io"
import "../styles/header.css"

function Header({
	selectedDate,
	setSelectedDate,
	setOpenLeft,
	openLeft,
	handleOpenEvent,
	setDisplayCalendar,
	displayCalendar,
}) {
	const [openModalInfo, setOpenModalInfo] = useState(false)
	const [dateToDisplay, setDateToDisplay] = useState(
		format(selectedDate, "MMMM yyyy"),
	)

	useEffect(() => {
		if (displayCalendar === "week") {
			setDateToDisplay(
				`${format(selectedDate, "Io")} week of ${format(selectedDate, "yyyy")}`,
			)
		}
		if (displayCalendar === "year") {
			setDateToDisplay(format(selectedDate, "yyyy"))
		}
		if (displayCalendar === "day") {
			setDateToDisplay(format(selectedDate, "d MMMM yyyy"))
		}
		if (displayCalendar === "month") {
			setDateToDisplay(format(selectedDate, "MMMM yyyy"))
		}
	}, [displayCalendar, selectedDate])

	function handleArrowSelectorDate(date, inc) {
		if (displayCalendar === "week") {
			setSelectedDate(addWeeks(date, inc))
		}
		if (displayCalendar === "year") {
			setSelectedDate(addYears(date, inc))
		}
		if (displayCalendar === "day") {
			setSelectedDate(addDays(date, inc))
		}
		if (displayCalendar === "month") {
			setSelectedDate(addMonths(date, inc))
		}
	}

	return (
		<>
			<div className='header-container'>
				<div className='left-side-header'>
					<div className='title-app'>
						<img
							className='logo'
							src={process.env.PUBLIC_URL + "logo.png"}
							alt='Calendar logo'
						/>
						My Time Line
					</div>
					{openLeft ? (
						<BsArrowBarLeft
							className='left-menu-icon'
							onClick={() => setOpenLeft(!openLeft)}
						/>
					) : (
						<BsArrowBarRight
							className='left-menu-icon'
							onClick={() => setOpenLeft(!openLeft)}
						/>
					)}
				</div>

				<div className='header'>
					<button className='btn' onClick={() => setSelectedDate(new Date())}>
						Today
					</button>
					<span onClick={() => handleArrowSelectorDate(selectedDate, "-1")}>
						<IoIosArrowBack className='month-change-btn' />
					</span>
					<span className='month-title typo'>{dateToDisplay}</span>
					<span onClick={() => handleArrowSelectorDate(selectedDate, "1")}>
						<IoIosArrowForward className='month-change-btn' />
					</span>
				</div>
				<div className='right-side-header'>
					<button
						className='btn btn-header extra-margin-right'
						onClick={() => handleOpenEvent("add")}>
						New Event
					</button>
					<form onChange={e => setDisplayCalendar(e.target.value)}>
						<select className='btn btn-header'>
							<option value='month'>Month</option>
							<option value='day'>Day</option>
							<option value='week'>Week</option>
							<option value='year'>Year</option>
						</select>
					</form>
					<button
						className='btn btn-header'
						onClick={() => setOpenModalInfo(true)}>
						Help
					</button>
				</div>
			</div>
			<ModalInfo open={openModalInfo} onClose={() => setOpenModalInfo(false)} />
		</>
	)
}

export default Header
