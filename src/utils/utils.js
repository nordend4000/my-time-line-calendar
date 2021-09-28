import {
	format,
	startOfWeek,
	startOfMonth,
	endOfWeek,
	endOfMonth,
	eachDayOfInterval,
	nextMonday,
	addHours,
	getHours,
	subHours,
	addMonths,
	getYear,
} from "date-fns"

export function getArrayOfEvents(arr, day) {
	let arrayOfEvents = []
	// eslint-disable-next-line
	arr.filter(el => {
		if (el.timestamp === format(day, "T")) return arrayOfEvents.push(el)
	})
	return arrayOfEvents
}
export function getAllOtherEvents(mainArray, entry) {
	return mainArray.filter(element => {
		return element.eventId !== entry.eventId
	})
}
export function getAllOtherEventsThanRepeated(mainArray, entry) {
	return mainArray.filter(element => {
		return (
			element.eventId !== entry.eventId && element.repeatId !== entry.repeatId
		)
	})
}
export function getRepeatedEvents(mainArray, entry) {
	return mainArray.filter(element => {
		return element.repeatId === entry.repeatId
	})
}
export function getNextMonday(date) {
	const firstDay = new Date(
		`1 ${format(date, "MMMM")} 
		${format(date, "yyyy")}`,
	)
	return nextMonday(firstDay)
}
export function filterMultipleDate(event, day) {
	let filterDate = false
	if (event.multipleDates.length > 0) {
		// eslint-disable-next-line
		event.multipleDates.filter(date => {
			if (date.toString().substring(0, 15) !== day.toString().substring(0, 15))
				return null
			else {
				filterDate = true
			}
		})
	}
	return filterDate
}
export function createArrayOfHours(selectedDate) {
	const initSelectedDate = subHours(selectedDate, getHours(selectedDate))
	let incrementor = 1
	let arrayOfHours = []
	while (incrementor <= 24) {
		arrayOfHours.push(format(addHours(initSelectedDate, incrementor), "HH a"))
		incrementor++
	}
	return arrayOfHours
}
export function initializeMonth(selectedDate) {
	const firstWeekStart = startOfWeek(startOfMonth(selectedDate), {
		weekStartsOn: 1,
	})
	const lastWeekEnd = endOfWeek(endOfMonth(selectedDate), {
		weekStartsOn: 1,
	})
	const dates = eachDayOfInterval({
		start: firstWeekStart,
		end: lastWeekEnd,
	})
	return dates
}
export function initializeWeek(selectedDate) {
	const weekStart = startOfWeek(selectedDate, {
		weekStartsOn: 1,
	})
	const weekEnd = endOfWeek(selectedDate, {
		weekStartsOn: 1,
	})
	const dates = eachDayOfInterval({
		start: weekStart,
		end: weekEnd,
	})
	return dates
}
export function initializeYear(selectedDate) {
	let year = new Date(`1 JANUARY ${getYear(selectedDate)}`)
	let month = 0
	let arrayYear = []
	while (month < 12) {
		const firstWeekStart = startOfWeek(startOfMonth(year), {
			weekStartsOn: 1,
		})
		const lastWeekEnd = endOfWeek(endOfMonth(year), {
			weekStartsOn: 1,
		})
		const dates = eachDayOfInterval({
			start: firstWeekStart,
			end: lastWeekEnd,
		})
		arrayYear.push(dates)
		year = addMonths(year, 1)
		month++
	}
	return arrayYear
}
export function arrayOfDateFromEvents(events, day) {
	let filter = []
	events.forEach(event => {
		if (
			new Date(`${event.date}`).toString().substring(0, 15) !==
			day.toString().substring(0, 15)
		) {
			return
		}
		filter.push(new Date(`${event.date}`).toString().substring(0, 15))
	})
	return filter
}
