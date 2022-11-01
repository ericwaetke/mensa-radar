import { use } from "react";
import { Offer } from "../../../../components/offer";
import { getWeekdayByName } from "../../../../lib/getWeekdayByName";

const getFoodOffers = async (mensa: string | string[], day: string | string[]) => {
	const selectedWeekday = getWeekdayByName(day)
	const dev = process.env.NODE_ENV !== 'production';
	const props = await fetch(`${dev ? 'http://localhost:3000' : 'https://mensa-radar.de'}/api/getMensaData`, {
		method: 'POST',
		body: JSON.stringify({
			selectedWeekday,
			mensa
		}),
		next: {
			revalidate: 60*5
		}
	})
	return props.json()
}

export default function OffersPage({props}) {
    console.log(props)
    const {mensa, day} = props
    const foodOffers = use(getFoodOffers(mensa, day))
    
    return <div 
                // variants={anim01} 
                // initial="hidden" 
                // animate="show"
                >
            {
                // Show Vegan first
                foodOffers.map((offer, i) => {
                    if(offer.labels.foodType === "vegan" && !offer.soldOut){
                        return (
                            <Offer key={i} offer={offer} mensa={mensa} day={day}/>
                        )
                    }
                })
            }
            {
                // Show Vegetarian second
                foodOffers.map((offer, i) => {
                    if(offer.labels.foodType === "vegetarisch" && !offer.soldOut){
                        return (
                            <Offer key={i} offer={offer} mensa={mensa} day={day}/>
                        )
                    }
                })
            }
            {
                // Show rest later
                foodOffers.map((offer, i) => {
                    if(offer.labels.foodType !== "vegan" && offer.labels.foodType !== "vegetarisch" && !offer.soldOut){
                        return (
                            <Offer key={i} offer={offer} mensa={mensa} day={day}/>
                        )
                    }
                })
            }

            {
                // Sold out
            }
            {
                foodOffers.map((offer, i) => {
                    if(offer.soldOut){
                        return (
                            <Offer key={i} offer={offer} mensa={mensa} day={day}/>
                        )
                    }
                })
            }
            </div>
}