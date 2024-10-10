export default {
	dialect: 'postgresql',
	schema: './drizzle/schema.ts',
	out: './drizzle/migrations/',
	dbCredentials: {
		url: process.env.DATABASE_URI,
	},
}
