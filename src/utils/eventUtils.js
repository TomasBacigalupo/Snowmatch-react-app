import { formatDate } from "@fullcalendar/react"

export function eventToString(event){
    const {
        lessonTime,
        date,
        price
    } = event
    return `${formatDate(date)} ${lessonTime} ${price}`
}