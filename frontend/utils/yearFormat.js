export default function getYearNumber(dateString) {
    const date = new Date(dateString)
    return date.getFullYear()
}