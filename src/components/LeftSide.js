import React from "react"
import "../styles/leftside.css"
import SmallCalendar from "./SmallCalendar"
import { IoAddOutline } from "react-icons/io5"
import { AiOutlineCheck } from "react-icons/ai"

function LeftSide({
	selectedDate,
	setSelectedDate,
	dates,
	handleOpenEvent,
	blueFilter,
	redFilter,
	greenFilter,
	setRedFilter,
	setBlueFilter,
	setGreenFilter,
}) {
	return (
		<div className='left-side-container'>
			<button
				className='btn btn-left-side'
				onClick={() => handleOpenEvent("add")}>
				<IoAddOutline className='plus-icon' />
			</button>
			<SmallCalendar
				selectedDate={selectedDate}
				setSelectedDate={setSelectedDate}
				dates={dates}
			/>
			<div className='left-side-checkbox-container'>
				<h6>EVENTS :</h6>
				<div className='col-checkbox'>
					<div
						className='checkbox-left-side checkbox-blue'
						onClick={() => setBlueFilter(!blueFilter)}>
						{blueFilter ? <AiOutlineCheck className='center-checkbox' /> : ""}
					</div>
					<div className='hide-show dark-blue'>
						{blueFilter ? <>Hide My Blue events</> : <>Show My Blue events</>}
					</div>
				</div>
				<div className='col-checkbox'>
					<div
						className='checkbox-left-side checkbox-green'
						onClick={() => setGreenFilter(!greenFilter)}>
						{greenFilter ? <AiOutlineCheck className='center-checkbox' /> : ""}
					</div>
					<div className='hide-show dark-green'>
						{greenFilter ? (
							<>Hide My Green events</>
						) : (
							<>Show My Green events</>
						)}
					</div>
				</div>
				<div className='col-checkbox'>
					<div
						className='checkbox-left-side checkbox-red'
						onClick={() => setRedFilter(!redFilter)}>
						{redFilter ? <AiOutlineCheck className='center-checkbox' /> : ""}
					</div>
					<div className='hide-show dark-red'>
						{redFilter ? <>Hide My Red events</> : <>Show My Red events</>}
					</div>
				</div>
			</div>
		</div>
	)
}

export default LeftSide
