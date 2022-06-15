import { NutrientComponent } from "./nutrientComponent"

export const NutrientOverview = ({nutrients}) => {
    console.log(nutrients)
    return (
        <div className='px-6 flex flex-none break-all' style={{gridTemplateArea: "Eiweiß Kohlenhydrate Fett\nEnergie Energie Energie"}}>
            {nutrients.map((nutrient) => <NutrientComponent nutrient={nutrient} />)}
        </div>
    )
}