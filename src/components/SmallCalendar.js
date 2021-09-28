import React from "react"
import SmallMonth from "./SmallMonth"
import { format, addMonths } from "date-fns"
import { IoIosArrowBack } from "react-icons/io"
import { IoIosArrowForward } from "react-icons/io"

function SmallCalendar({ selectedDate, setSelectedDate, dates }) {
	return (
		<div className='small-calendar-container'>
			<div className='small-calendar-title'>
				<span onClick={() => setSelectedDate(addMonths(selectedDate, -1))}>
					<IoIosArrowBack className='small-month-change-btn' />
				</span>
				<span>{format(selectedDate, "MMMM yyyy")}</span>
				<span onClick={() => setSelectedDate(addMonths(selectedDate, 1))}>
					<IoIosArrowForward className='small-month-change-btn' />
				</span>
			</div>
			<SmallMonth
				dates={dates}
				selectedDate={selectedDate}
				setSelectedDate={setSelectedDate}
			/>
		</div>
	)
}

export default SmallCalendar
