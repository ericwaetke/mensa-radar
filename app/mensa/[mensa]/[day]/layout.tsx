import { createClient } from "@supabase/supabase-js";
import { use } from "react";
import { getWeekdayByName } from "../../../../lib/getWeekdayByName";


export default function DayLayout({ children, params}) {
	
	
	return <>

		<section>
			{children}
		</section>
	</>
}