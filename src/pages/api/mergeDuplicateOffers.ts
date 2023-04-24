import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/getSupabaseClient';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {


		const {data: offers, error: offersError} = await supabase
			.from('food_offerings')
			.select('id, mensa, food_title')


		// Find offers where the mensa and food_title are the same
		const duplicateOffers = offers.filter((offer, index) => {
			const duplicate = offers.find((otherOffer, otherIndex) => {
				return offer.mensa === otherOffer.mensa && offer.food_title === otherOffer.food_title && index !== otherIndex
			})
			return duplicate !== undefined
		})

		// Filter out the first offer of each duplicate
		const offersToMerge = duplicateOffers.filter((offer, index) => {
			const duplicate = duplicateOffers.find((otherOffer, otherIndex) => {
				return offer.mensa === otherOffer.mensa && offer.food_title === otherOffer.food_title && index > otherIndex
			})
			return duplicate === undefined
		})

		// Delete offersToMerge
		const deletePromises = offersToMerge.map(offer => {
			return supabase
				.from('food_offerings')
				.delete()
				.eq('id', offer.id)
		})
		
		return Promise.all(deletePromises).then(
			() => {
				res.status(200).json({message: 'Success'})
			}
		).catch(
			(error) => {
				res.status(500).json({error})
			}
		)
	} catch (e) {
		res.status(500).json({
			e
		});
	}
}

