import { readFileSync } from "fs";

const databasePassword = process.env.POSTGRES_PASSWORD_FILE
  ? readFileSync(process.env.POSTGRES_PASSWORD_FILE, "utf8")
  : undefined;

export default {
  dialect: 'postgresql',
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations/',
  dbCredentials: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: databasePassword,
    database: process.env.POSTGRES_DB,
  },
}
