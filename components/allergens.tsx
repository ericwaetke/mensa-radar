export const Allergens = (
	{
		allergens,
	}: {
		allergens: string[]
	}
) => {


	const allergyHelper = {
		"Farbstoff": {
			name: "Farbstoff",
			icon: "" //colorpicker
		},
		"Gluten aus Weizen": {
			name: "Gluten aus Weizen",
			icon: "getreide"
		},
		"Macadamia": {
			name: "Macadamia",
			icon: "" //nut
		},
		"Konservierungsstoff": {
			name: "Konservierungsstoff",
			icon: "" //chemie
		},
		"Gluten aus Roggen": {
			name: "Gluten Roggen",
			icon: "getreide"
		},
		"Sellerie": {
			name: "Sellerie",
			icon: "sellerie"
		},
		"Antioxidationsmittel": {
			name: "Antioxidationsmittel",
			icon: "" //test tube
		},
		"Gluten aus Hafer": {
			name: "Gluten Hafer",
			icon: "getreide"
		},
		"Senf": {
			name: "Senf",
			icon: "senf"
		},
		"Geschmacksverstärker": {
			name: "Geschmacksverstärker",
			icon: "" //chemie
		},
		"Gluten aus Dinkel": {
			name: "Gluten Dinkel",
			icon: "getreide"
		},
		"Sesamsamen": {
			name: "Sesamsamen",
			icon: "sesamsamen"
		},
		"geschwefelt": {
			name: "geschwefelt",
			icon: "" //chemie
		},
		"Gluten aus Kamut": {
			name: "Gluten aus Kamut",
			icon: "getreide"
		},
		"Schwefeldioxid/Sulphite": {
			name: "Schwefeldioxid/Sulphite",
			icon: "sulphite"
		},
		"geschwärzt": {
			name: "geschwärzt",
			icon: "" //black cat
		},
		"Gluten aus Gerste": {
			name: "Gluten aus Gerste",
			icon: "getreide"
		},
		"Lupinen": {
			name: "Lupinen",
			icon: "erdnüsse" 
		},
		"gewachst": {
			name: "gewachst",
			icon: "" //bee
		},
		"Krebstiere": {
			name: "Krebstiere",
			icon: "krebstiere"
		},
		"Weichtiere": {
			name: "Weichtiere",
			icon: "weichtiere"
		},
		"Phosphat": {
			name: "Phosphat",
			icon: "" //chemieding
		},
		"Eier": {
			name: "Eier",
			icon: "eier"
		},
		"Süßungsmitteln": {
			name: "Süßungsmitteln",
			icon: "" //sweetener
		},
		"Fisch": {
			name: "Fisch",
			icon: "fisch"
			
		},
		"enthält eine Phenylalaninquelle": {
			name: "Phenylalanin",
			icon: "" //protein
		},
		"Erdnüsse": {
			name: "Erdnüsse",
			icon: "erdnüsse"
		},
		"chininhaltig": {
			name: "chininhaltig",
			icon: "" //powder
		},
		"Sojabohnen": {
			name: "Sojabohnen",
			icon: "sojabohnen"
		},
		"koffeinhaltig": {
			name: "koffeinhaltig",
			icon: "" //coffee
		},
		"Milch": {
			name: "Milch",
			icon: "milch"
		},
		"kakaohaltige Fettglasur": {
			name: "kakaohaltige Fettglasur",
			icon: "" //sparkling
		},
		"Mandeln": {
			name: "Mandeln",
			icon: "" //nut
		},
		"enthält tierisches Lab": {
			name: "tierisches Lab",
			icon: "" //ox
		},
		"Haselnüsse": {
			name: "Haselnüsse",
			icon: "haselnüsse" 
		},
		"Alkohol": {
			name: "Alkohol",
			icon: "" //wine
		},
		"Walnüsse": {
			name: "Walnüsse",
			icon: "" //nut
		},
		"Gelatine": {
			name: "Gelatine",
			icon: "" //jelly
		},
		"Kaschunüsse": {
			name: "Cashewnüsse",
			icon: "" //nut
		},
		"Knoblauch": {
			name: "Knoblauch",
			icon: "" //garlic
		},
		"Pecannüsse": {
			name: "Pecannüsse",
			icon: "" //nut
		},
		"Paranüsse": {
			name: "Paranüsse",
			icon: "" //nut
		},
		"Pistazien": {
			name: "Pistazien",
			icon: "" //nut
		},
	}

	return (
		<div className="-mx-1 px-4 pb-4 flex flex-row flex-wrap gap-y-1">
			{
				allergens.map((allergen, index) => {
					return (
						<div className="mx-1 flex flex-row space-x-0.5 text-gray/50" key={index}> 
							{
								allergyHelper[allergen] ? <>
									{
										allergyHelper[allergen].icon !== "" ? (
											<img src={`/icons/allergene/${allergyHelper[allergen].icon}.svg`} className="w-3.5 opacity-50 align-bottom" />
										) : null
									}
									<p className="text-sm font-serif-reg">{allergyHelper[allergen].name}</p>
								</> : null
							}
						</div>
					)
				})
			}
		</div>
	)
}