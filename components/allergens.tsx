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
			icon: ""
		},
		"Gluten aus Weizen": {
			name: "Gluten aus Weizen",
			icon: ""
		},
		"Macadamia": {
			name: "Macadamia",
			icon: ""
		},
		"Konservierungsstoff": {
			name: "Konservierungsstoff",
			icon: ""
		},
		"Gluten aus Roggen": {
			name: "Gluten aus Roggen",
			icon: ""
		},
		"Sellerie": {
			name: "Sellerie",
			icon: ""
		},
		"Antioxidationsmittel": {
			name: "Antioxidationsmittel",
			icon: ""
		},
		"Gluten aus Hafer": {
			name: "Gluten aus Hafer",
			icon: ""
		},
		"Senf": {
			name: "Senf",
			icon: ""
		},
		"Geschmacksverstärker": {
			name: "Geschmacksverstärker",
			icon: ""
		},
		"Gluten aus Dinkel": {
			name: "Gluten aus Dinkel",
			icon: ""
		},
		"Sesamsamen": {
			name: "Sesamsamen",
			icon: ""
		},
		"geschwefelt": {
			name: "geschwefelt",
			icon: ""
		},
		"Gluten aus Kamut": {
			name: "Gluten aus Kamut",
			icon: ""
		},
		"Schwefeldioxid/Sulphite": {
			name: "Schwefeldioxid/Sulphite",
			icon: ""
		},
		"geschwärzt": {
			name: "geschwärzt",
			icon: ""
		},
		"Gluten aus Gerste": {
			name: "Gluten aus Gerste",
			icon: ""
		},
		"Lupinen": {
			name: "Lupinen",
			icon: ""
		},
		"gewachst": {
			name: "gewachst",
			icon: ""
		},
		"Krebstiere": {
			name: "Krebstiere",
			icon: ""
		},
		"Weichtiere": {
			name: "Weichtiere",
			icon: ""
		},
		"Phosphat": {
			name: "Phosphat",
			icon: ""
		},
		"Eier": {
			name: "Eier",
			icon: ""
		},
		"Süßungsmitteln": {
			name: "Süßungsmitteln",
			icon: ""
		},
		"Fisch": {
			name: "Fisch",
			icon: ""
		},
		"enthält eine Phenylalaninquelle": {
			name: "Phenylalaninquelle",
			icon: ""
		},
		"Erdnüsse": {
			name: "Erdnüsse",
			icon: ""
		},
		"chininhaltig": {
			name: "chininhaltig",
			icon: ""
		},
		"Sojabohnen": {
			name: "Sojabohnen",
			icon: ""
		},
		"koffeinhaltig": {
			name: "koffeinhaltig",
			icon: ""
		},
		"Milch": {
			name: "Milch",
			icon: ""
		},
		"kakaohaltige Fettglasur": {
			name: "kakaohaltige Fettglasur",
			icon: ""
		},
		"Mandeln": {
			name: "Mandeln",
			icon: ""
		},
		"enthält tierisches Lab": {
			name: "tierisches Lab",
			icon: ""
		},
		"Haselnüsse": {
			name: "Haselnüsse",
			icon: ""
		},
		"Alkohol": {
			name: "Alkohol",
			icon: ""
		},
		"Walnüsse": {
			name: "Walnüsse",
			icon: ""
		},
		"Gelatine": {
			name: "Gelatine",
			icon: ""
		},
		"Kaschunüsse": {
			name: "Kaschunüsse",
			icon: ""
		},
		"Knoblauch": {
			name: "Knoblauch",
			icon: ""
		},
		"Pecannüsse": {
			name: "Pecannüsse",
			icon: ""
		},
		"Paranüsse": {
			name: "Paranüsse",
			icon: ""
		},
		"Pistazien": {
			name: "Pistazien",
			icon: ""
		},
	}

	return (
		<div className="-mx-1 px-4 pb-4">
			{
				allergens.map((allergen, index) => {
					return (
						<div className="mx-1 inline-flex flex-row space-x-0.5 text-gray/50" key={index}> 
						{
							allergyHelper[allergen].icon !== "" ? (
								<img src={`/icons/allergene/${allergyHelper[allergen].icon}.svg`} className="w-4 stroke-gray/50 opacity-70 " />
							) : null
						}
							<p className="text-sm font-serif-reg">{allergyHelper[allergen].name}</p>
						</div>
					)
				})
			}
		</div>
	)
}