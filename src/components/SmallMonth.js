import React from "react"
import { format, isSameMonth, isSameDay, isBefore } from "date-fns"
import { getNextMonday } from "../utils/utils"

function SmallMonth({ dates, selectedDate, setSelectedDate }) {
	return (
		<div className='small-days'>
			{dates.map(day => (
				<div
					key={format(day, "t")}
					className={
						isBefore(day, getNextMonday(selectedDate)) ? "week-name" : "hide"
					}>
					{format(day, "eeeee")}
				</div>
			))}
			{dates.map(day => (
				<div
					key={format(day, "T")}
					onClick={() => setSelectedDate(new Date(day))}
					className={
						!isSameMonth(day, selectedDate)
							? "small-day left-side-non-month-day"
							: "small-day"
					}>
					<div className='day-header'>
						<div
							className={
								!isSameDay(day, selectedDate)
									? "day-number"
									: "day-number active"
							}>
							{format(day, "dd")}
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default SmallMonth
