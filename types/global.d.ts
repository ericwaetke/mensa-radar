type MensaData = {
    created_at: string,
    daysWithFood: string[],
    id: number,
    loc_lat: string,
    loc_long: string,
    mensa: number,
    name: string,
    open: true | false | null,
    openingTimes: {open: boolean, text: string},
    url: string,
}