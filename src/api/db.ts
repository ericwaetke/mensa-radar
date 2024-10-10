import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../../drizzle/schema'

const queryClient = postgres(
	'postgres://mensauser:postgres@127.0.0.1:5432/mensahhub',
)
export const db = drizzle(queryClient, { schema })
