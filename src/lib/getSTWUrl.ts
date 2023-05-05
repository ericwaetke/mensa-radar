export const getSTWUrl = (mensa) => {
  const urls = {
    golm: "https://xml.stw-potsdam.de/xmldata/go/xml.php",
    fhp: "https://xml.stw-potsdam.de/xmldata/ka/xml.php",
    neues_palais: "https://xml.stw-potsdam.de/xmldata/np/xml.php",
    cafeteria_neues_palais: "https://xml.stw-potsdam.de/xmldata/cnp/xml.php",
    brandenburg: "https://xml.stw-potsdam.de/xmldata/b/xml.php",
    filmuniversitaet: "https://xml.stw-potsdam.de/xmldata/fi/xml.php",
    griebnitzsee: "https://xml.stw-potsdam.de/xmldata/gs/xml.php",
    wildau: "https://xml.stw-potsdam.de/xmldata/w/xml.php",
  }

  switch (mensa) {
    case "neues-palais":
      return urls.neues_palais
    case "cafeteria-neues-palais":
      return urls.cafeteria_neues_palais
    default:
      return urls[mensa]
  }
}
