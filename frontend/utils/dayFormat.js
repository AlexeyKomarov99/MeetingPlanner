export default function getDayNumber(dateString) {
    const date = new Date(dateString)
    return date.getDate()
}