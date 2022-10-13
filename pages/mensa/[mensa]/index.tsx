import Router from "next/router"

export default function Index(props) {
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

    Router.push(`/mensa/${props.mensa}/${weekday[currentWeekday]}`)
    return <></>
}

export async function getStaticPaths() {
    return {
        // paths: mensaData.map((mensa) => {
        //     return {
        //         params: {
        //             mensa: mensa.url
        //         }
        //     }
        // }),
        paths: [],
        fallback: true
    }
}

export async function getStaticProps(context) {
    // Redirect to current day
    return {
        props: {
            mensa: context.params.mensa,
        }
    }
}