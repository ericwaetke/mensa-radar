export default function Index(props) {
}

export async function getServerSideProps(context) {
    const currentDate = new Date()
	let currentWeekday = currentDate.getDay()
	currentWeekday = currentWeekday === 0 ? 6 : currentWeekday - 1
    const weekday = [
        "montag",
        "dienstag",
        "mittwoch",
        "donnerstag",
        "freitag",
        "samstag",
        "sonntag"
    ]

    // Redirect to current day
    return {
        redirect: {
            permanent: false,
            destination: `${context.query.mensa}/${weekday[currentWeekday]}`
        }
    }
}