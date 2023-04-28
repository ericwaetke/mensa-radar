import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		SUPABASE_KEY: z.string().min(200),
		CLOUD_VISION_KEY_ID: z.string().min(200),
		CLOUD_VISION_KEY: z.string().min(200),

		DEEPL_API_KEY: z.string().min(30),

		REVALIDATION_TOKEN: z.string().length(32),
	},
	client: {
		NEXT_PUBLIC_SUPABASE_URL: z.string().min(32).url(),
		NEXT_PUBLIC_SUPABASE_KEY: z.string().min(200),
	},
	runtimeEnv: {
		SUPABASE_KEY: process.env.SUPABASE_KEY,
		CLOUD_VISION_KEY_ID: process.env.CLOUD_VISION_KEY_ID,
		CLOUD_VISION_KEY: process.env.CLOUD_VISION_KEY,

		DEEPL_API_KEY: process.env.DEEPL_API_KEY,

		REVALIDATION_TOKEN: process.env.REVALIDATION_TOKEN,

		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY,
	},
});
