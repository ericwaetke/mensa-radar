'use server'
import { redirect } from '@solidjs/router'
import { useSession } from 'vinxi/http'
import { and, eq, InferSelectModel, like } from 'drizzle-orm'
import { db } from './db'
import {
  additives,
  allergens,
  features,
  features_locales,
  mensa,
  mensa_provider,
  recipes,
  recipes_locales,
  recipes_rels,
  servings,
} from '../../drizzle/schema'
import { locale, localeRels } from '@/migrations/schema'

export async function getMensas() {
  const mensas = await db
    .select()
    .from(mensa_provider)
    .innerJoin(
      mensa,
      eq(mensa_provider.id, mensa.provider_id),
    )

  const sortedAfterProvider = new Map<
    InferSelectModel<typeof mensa_provider>,
    typeof mensas
  >()
  for (const mensa of mensas) {
    const provider = mensa.mensa_provider
    if (!provider) throw new Error('Provider slug is missing')

    if (!sortedAfterProvider.has(provider)) {
      sortedAfterProvider.set(provider, [])
    }
    sortedAfterProvider.get(provider)!.push(mensa)
  }

  return sortedAfterProvider
}

export async function getMensa(slug: string) {
  const res = await db
    .select({
      name: mensa.name,
    })
    .from(mensa)
    .where(eq(mensa.slug, slug))
    .innerJoin(
      mensa_provider,
      eq(mensa.provider_id, mensa_provider.id),
    )
    .limit(1)

  return res[0]
}

type Recipe = typeof recipes.$inferSelect
type Feature = typeof features.$inferSelect

export async function getServings(
  mensaSlug: string,
  date: string,
  language: 'en' | 'de' = 'de',
) {
  // get mensa from db
  // const _mensa = db.select().from(mensa).where();
  const rows = await db
    .select({
      date: servings.date,
      recipe: {
        id: recipes.id,
        name: recipes_locales.name,
        price_students: recipes.price_students,
        price_employees: recipes.price_employees,
        price_guests: recipes.price_guests,
      },
      feature: {
        name: features_locales.name,
      },
    })
    .from(servings)
    .innerJoin(mensa, eq(servings.mensa_id, mensa.id))
    .innerJoin(recipes, eq(servings.recipe_id, recipes.id))
    .innerJoin(
      locale,
      eq(locale.locale, language),
    )
    .innerJoin(localeRels, eq(localeRels.parentId, recipes.id))
    .innerJoin(recipes_rels, eq(recipes_rels.parent_id, recipes.id))
    .innerJoin(features, eq(recipes_rels.features_id, features.id))
    .innerJoin(
      features_locales,
      eq(features_locales._parent_id, features.id),
    )
    .where(
      and(
        eq(mensa.slug, mensaSlug),
        eq(servings.date, date),
        eq(recipes_locales._locale, language),
        eq(features_locales._locale, language),
      ),
    )

  // Aggregate the rows into a list of servings
  // with features as array
  const _servings: {
    date: string
    recipe: {
      name: string
      price_students: string | null
      price_employees: string | null
      price_guests: string | null
    }
    features: string[]
  }[] = []

  for (const row of rows) {
    const { date, recipe, feature } = row
    console.log(recipe.name)

    const serving = _servings.find((s) => s.recipe.name === recipe.name)
    if (serving) {
      if (!feature.name) continue
      serving.features.push(feature.name!)
    } else {
      _servings.push({
        date,
        recipe,
        features: feature.name ? [feature.name] : [],
      })
    }
  }

  return _servings
}
