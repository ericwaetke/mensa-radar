export const getSTWUrl = (mensa) => {
    const urls = {
		golm: "https://xml.stw-potsdam.de/xmldata/go/xml.php",
		fhp: "https://xml.stw-potsdam.de/xmldata/ka/xml.php",
		neues_palais: "https://xml.stw-potsdam.de/xmldata/np/xml.php"
	}

	switch (mensa) {
		case "golm":
			return urls.golm
		case "fhp":
			return urls.fhp
		case "neues-palais":
			return urls.neues_palais
		default:
			return urls.fhp
	}
}