"use server";
import { redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";
import { and, eq, like } from "drizzle-orm";
import { db } from "./db";
import {
	mensa,
	mensa_provider,
	recipes,
	recipes_locales,
	servings,
} from "../../drizzle/schema";

export async function getMensas() {
	const mensas = db
		.select()
		.from(mensa)
		.innerJoin(mensa_provider, eq(mensa_provider.id, mensa.provider_id));
	return mensas;
}

export async function getServings(
	mensaSlug: string,
	date: string,
	language: "en" | "de" = "de",
) {
	// get mensa from db
	// const _mensa = db.select().from(mensa).where();
	const _servings = db
		.select()
		.from(servings)
		.innerJoin(mensa, eq(servings.mensa_id, mensa.id))
		.innerJoin(recipes, eq(servings.recipe_id, recipes.id))
		.innerJoin(recipes_locales, eq(recipes_locales._parent_id, recipes.id))
		.where(
			and(
				eq(mensa.slug, mensaSlug),
				eq(servings.date, date),
				eq(recipes_locales._locale, language),
			),
		);

	return _servings;
}
