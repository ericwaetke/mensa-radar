"use server";
import { redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { mensa, recipes, recipes_locales, servings } from "../../drizzle/schema";


export async function getMensas() {
  const mensas = db.select().from(mensa)
  return mensas;
}

export async function getServings(mensaSlug: string) {
  // get mensa from db
  // const _mensa = db.select().from(mensa).where();
  const _servings = db.select()
    .from(servings)
    .leftJoin(mensa, eq(servings.mensa_id, mensa.id)).where(eq(mensa.slug, mensaSlug))
    .leftJoin(recipes, eq(servings.recipe_id, recipes.id))
    .leftJoin(recipes_locales, eq(recipes_locales._parent_id, recipes.id))
  return _servings;
}
