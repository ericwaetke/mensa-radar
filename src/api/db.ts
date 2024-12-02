import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../../drizzle/schema'
import { readFileSync } from 'fs';

const databasePassword = process.env.POSTGRES_PASSWORD_FILE
  ? readFileSync(process.env.POSTGRES_PASSWORD_FILE, "utf8")
  : process.env.POSTGRES_PASSWORD;
const databaseURI = `postgres://${process.env.POSTGRES_USER}:${databasePassword}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
console.log("databaseURI: ", databaseURI);

const queryClient = postgres(databaseURI)
export const db = drizzle(queryClient, { schema })
