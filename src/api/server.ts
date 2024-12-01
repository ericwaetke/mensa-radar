'use server'
import { redirect } from '@solidjs/router'
import { useSession } from 'vinxi/http'
import { and, eq, InferSelectModel, like } from 'drizzle-orm'
import { db } from './db'
import {
  additives,
  allergens,
  features,
  featuresLocales,
  mensa,
  mensaProvider,
  recipes,
  recipesLocales,
  recipesRels,
  servings,
  locale,
  localeRels
} from '../../drizzle/schema'
import { sql } from 'drizzle-orm'

export async function getMensas() {
  const mensas = await db
    .select()
    .from(mensaProvider)
    .innerJoin(
      mensa,
      eq(mensaProvider.id, mensa.providerId),
    )

  const sortedAfterProvider = new Map<
    InferSelectModel<typeof mensaProvider>,
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
    .select()
    .from(mensa)
    .where(eq(mensa.slug, slug))
    .innerJoin(
      mensaProvider,
      eq(mensa.providerId, mensaProvider.id),
    )
    .limit(1)

  return res[0]
}

type Recipe = typeof recipes.$inferSelect
type Feature = typeof features.$inferSelect

export async function getServings(
  params: {
    mensaSlug: string,
    date: string,
    language: 'en' | 'de',
  }
) {
  console.log("Params: ", params)
  const { mensaSlug, date, language = "de" } = params
  if (!mensaSlug) return
  console.log("mensaSlug: ", mensaSlug)
  // if (!mensaSlug) throw new Error('mensaSlug is missing')
  console.log(date)
  // get mensa from db
  // const _mensa = db.select().from(mensa).where();
  const rows = await db
    .select({
      date: servings.date,
      recipe: {
        id: recipes.id,
        name: locale.name,
        price_students: recipes.priceStudents,
        price_employees: recipes.priceEmployees,
        price_guests: recipes.priceGuests,
      },
      feature: {
        name: featuresLocales.name,
      },
    })
    .from(servings)
    .innerJoin(mensa, eq(servings.mensaId, mensa.id))
    .innerJoin(recipes, eq(servings.recipeId, recipes.id))
    .innerJoin(localeRels, eq(recipes.id, localeRels.recipesId))
    .innerJoin(locale, eq(localeRels.parentId, locale.id))
    .fullJoin(recipesRels, eq(recipes.id, recipesRels.parentId))
    .fullJoin(features, eq(recipesRels.featuresId, features.id))
    .fullJoin(
      featuresLocales,
      eq(featuresLocales.parentId, features.id),
    )
    .where(
      and(
        eq(mensa.slug, mensaSlug),
        sql`(date AT TIME ZONE 'CET')::date = ${date}`,
        eq(locale.locale, language),
        // eq(featuresLocales.locale, language),
      ),
    )
  // console.log(rows)

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
    if (!date) continue

    const serving = _servings.find((s) => s.recipe.name === recipe.name)
    if (serving) {
      if (!feature || !feature.name) continue
      serving.features.push(feature.name!)
    } else {
      _servings.push({
        date,
        recipe,
        features: (feature && feature.name) ? [feature.name] : [],
      })
    }
  }

  console.log(_servings)

  return _servings
}
