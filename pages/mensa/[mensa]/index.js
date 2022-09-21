import { mensaData } from "../.."

export default function Index(props) {
}

export async function getStaticPaths() {
    return {
        paths: mensaData.map((mensa) => {
            return {
                params: {
                    mensa: mensa.url
                }
            }
        }),
        fallback: true
    }
}

export async function getStaticProps(context) {
    console.log(context)
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
            destination: `mensa/${context.params.mensa}/${weekday[currentWeekday]}`
        }
    }
}