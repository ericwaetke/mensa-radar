export const allergyChecker = (label) => {
    const foodTypes = {
        1: "mit Farbstoff",
        Wei: "Gluten aus Weizen",
        Mac: "Macadamia",
        2: "mit Konservierungsstoff",
        Rog: "Gluten aus Roggen",
        I: "Sellerie",
        3: "mit Antioxidationsmittel",
        Haf: "Gluten aus Hafer",
        J: "Senf",
        4: "mit Geschmacksverstärker",
        Din: "Gluten aus Dinkel",
        K: "Sesamsamen",
        5: "geschwefelt",
        Kam: "Gluten aus Kamut",
        L: "Schwefeldioxid/Sulphite",
        6: "geschwärzt",
        Ger: "Gluten aus Gerste",
        M: "Lupinen",
        7: "gewachst",
        B: "Krebstiere",
        N: "Weichtiere",
        8: "mit Phosphat",
        C: "Eier",
        9: "mit Süßungsmitteln",
        D: "Fisch",
        11: "enthält eine Phenylalaninquelle",
        E: "Erdnüsse",
        20: "chininhaltig",
        F: "Sojabohnen",
        21: "koffeinhaltig",
        G: "Milch",
        KF: "kakaohaltige Fettglasur",
        Man: "Mandeln",
        TL: "enthält tierisches Lab",
        Has: "Haselnüsse",
        AL: "mit Alkohol",
        Wal: "Walnüsse",
        GE: "mit Gelatine",
        Kas: "Kaschunüsse",
        KNO: "mit Knoblauch; Bärlauch",
        Pec: "Pecannüsse",
        Par: "Paranüsse",
        Pis: "Pistazien",
    }

    return foodTypes[label] ? foodTypes[label] : label
}