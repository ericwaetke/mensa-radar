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
			icon: "Getreide"
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
			icon: "Getreide"
		},
		"Sellerie": {
			name: "Sellerie",
			icon: "Sellerie"
		},
		"Antioxidationsmittel": {
			name: "Antioxidationsmittel",
			icon: "" //test tube
		},
		"Gluten aus Hafer": {
			name: "Gluten Hafer",
			icon: "Getreide"
		},
		"Senf": {
			name: "Senf",
			icon: "Senf"
		},
		"Geschmacksverstärker": {
			name: "Geschmacksverstärker",
			icon: "" //chemie
		},
		"Gluten aus Dinkel": {
			name: "Gluten Dinkel",
			icon: "Getreide"
		},
		"Sesamsamen": {
			name: "Sesamsamen",
			icon: "Sesamsamen"
		},
		"geschwefelt": {
			name: "geschwefelt",
			icon: "" //chemie
		},
		"Gluten aus Kamut": {
			name: "Gluten aus Kamut",
			icon: "Getreide"
		},
		"Schwefeldioxid/Sulphite": {
			name: "Schwefeldioxid/Sulphite",
			icon: "Sulphite"
		},
		"geschwärzt": {
			name: "geschwärzt",
			icon: "" //black cat
		},
		"Gluten aus Gerste": {
			name: "Gluten aus Gerste",
			icon: "Getreide"
		},
		"Lupinen": {
			name: "Lupinen",
			icon: "Erdnüsse" 
		},
		"gewachst": {
			name: "gewachst",
			icon: "" //bee
		},
		"Krebstiere": {
			name: "Krebstiere",
			icon: "Krebstiere"
		},
		"Weichtiere": {
			name: "Weichtiere",
			icon: "Weichtiere"
		},
		"Phosphat": {
			name: "Phosphat",
			icon: "" //chemieding
		},
		"Eier": {
			name: "Eier",
			icon: "Eier"
		},
		"Süßungsmitteln": {
			name: "Süßungsmitteln",
			icon: "" //sweetener
		},
		"Fisch": {
			name: "Fisch",
			icon: "Fisch"
			
		},
		"enthält eine Phenylalaninquelle": {
			name: "Phenylalanin",
			icon: "" //protein
		},
		"Erdnüsse": {
			name: "Erdnüsse",
			icon: "Erdnüsse"
		},
		"chininhaltig": {
			name: "chininhaltig",
			icon: "" //powder
		},
		"Sojabohnen": {
			name: "Sojabohnen",
			icon: "Sojabohnen"
		},
		"koffeinhaltig": {
			name: "koffeinhaltig",
			icon: "" //coffee
		},
		"Milch": {
			name: "Milch",
			icon: "Milch"
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
			icon: "Haselnüsse" 
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
		<div className="-mx-1 pb-4 flex flex-row flex-wrap gap-y-1">
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