import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/getSupabaseClient';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
        const { foodTitle } = req.body


        // Fetch Image from Diffuzers API

        res.status(200).json({foodTitle})

	} catch (e) {
		res.status(500).json({
			e
		});
	}
}