export const allergyChecker = (label) => {
    const foodTypes = {
        F: "Soja",
        G: "Milch",
        I: "Sellerie",
        Wei: "Glutenhaltiges Weizen",
        Ger: "Glutenhaltige Gerste",
        Haf: "Glutenhaltiges Hafer",
        C: "Eier",
        KNO: "mit Knoblauch",
        J: "Senf"
    }

    return foodTypes[label] ? foodTypes[label] : label
}
