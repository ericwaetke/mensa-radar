import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const queryClient = postgres(
	"postgres://mensauser:postgres@127.0.0.1:5432/mensahhub",
);
export const db = drizzle(queryClient);
