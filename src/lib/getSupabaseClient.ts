import { createClient } from "@supabase/supabase-js";
import { env } from "../env";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey)

