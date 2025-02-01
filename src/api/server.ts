'use server'
import { redirect } from '@solidjs/router'
import { useSession } from 'vinxi/http'
import { aliasedTable, and, eq, InferSelectModel, isNull, like, or } from 'drizzle-orm'
import { db } from './db'
import {
	additives,
	allergens,
	features,
	mensa,
	mensaProvider,
	recipes,
	recipesRels,
	servings,
	locale,
	localeRels
} from '../../drizzle/schema'
import { sql } from 'drizzle-orm'
import { featuresRelations } from '@/relations'
import { withServerActionInstrumentation } from '@sentry/solidstart'

export async function getMensas() {
	return withServerActionInstrumentation('getMensas', async () => {
		const mensas = await db
			.select()
			.from(mensaProvider)
			.innerJoin(
				mensa,
				eq(mensaProvider.id, mensa.providerId),
			)

		const sortedAfterProvider = new Map<
			string,
			typeof mensas
		>()
		for (const mensa of mensas) {
			const provider = mensa.mensa_provider
			if (!provider) throw new Error('Provider slug is missing')
			if (!provider.slug) continue

			if (!sortedAfterProvider.has(provider.slug)) {
				sortedAfterProvider.set(provider.slug, [])
			}
			sortedAfterProvider.get(provider.slug)!.push(mensa)
		}

		return sortedAfterProvider
	})
}

export async function getMensa(slug: string) {
	return withServerActionInstrumentation('getMensa', async () => {
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
	})
}

type Recipe = typeof recipes.$inferSelect
type Feature = typeof features.$inferSelect

export async function getServings(
	mensaSlug: string,
	date: string,
	language: 'en' | 'de',
) {
	return withServerActionInstrumentation('getServings', async () => {
		if (!mensaSlug) return
		// if (!mensaSlug) throw new Error('mensaSlug is missing')
		// get mensa from db
		// const _mensa = db.select().from(mensa).where();
		const recipeLocales = aliasedTable(locale, "recipeLocales")
		const featureLocaleRels = aliasedTable(localeRels, "featureLocaleRels")
		const featureLocales = aliasedTable(locale, "featureLocales")
		const rows = await db
			.select({
				date: servings.date,
				recipe: {
					id: recipes.id,
					name: recipeLocales.name,
					price_students: recipes.priceStudents,
					price_employees: recipes.priceEmployees,
					price_guests: recipes.priceGuests,
					category: recipes.category,
				},
				feature: {
					name: featureLocales.name,
					visible: features.visibleSmall
				},
			})
			.from(servings)
			.innerJoin(mensa, eq(servings.mensaId, mensa.id))
			.innerJoin(recipes, eq(servings.recipeId, recipes.id))
			.innerJoin(localeRels, eq(recipes.id, localeRels.recipesId))
			.innerJoin(recipeLocales, eq(localeRels.parentId, recipeLocales.id))
			.innerJoin(recipesRels, eq(recipes.id, recipesRels.parentId))
			// Features
			.innerJoin(features, eq(recipesRels.featuresId, features.id))
			.innerJoin(featureLocaleRels, eq(features.id, featureLocaleRels.featuresId))
			.innerJoin(featureLocales, eq(featureLocaleRels.parentId, featureLocales.id))
			.where(
				and(
					eq(mensa.slug, mensaSlug),
					sql`(date AT TIME ZONE 'CET')::date = ${date}`,
					eq(recipeLocales.locale, language),
					or(eq(featureLocales.locale, language), isNull(featureLocales.name))
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
				category: "main" | "dessert"
			}
			features: string[]
		}[] = []

		for (const row of rows) {
			const { date, recipe, feature } = row
			if (!date) continue

			const serving = _servings.find((s) => s.recipe.name === recipe.name)
			if (serving) {
				if (!feature || !feature.name || !feature.visible) continue
				serving.features.push(feature.name!)
			} else {
				_servings.push({
					date,
					recipe,
					features: (feature && feature.name && feature.visible) ? [feature.name] : [],
				})
			}
		}

		// Sort the servings by category
		_servings.sort((a, b) => {
			if (a.recipe.category === 'main' && b.recipe.category === 'dessert') return -1
			if (a.recipe.category === 'dessert' && b.recipe.category === 'main') return 1
			return 0
		})

		// Sort the features for each serving
		_servings.forEach(serving => {
			// Sort the features array with custom logic
			serving.features.sort((a, b) => {
				// Normalize the case to lowercase for reliable comparison
				const aLower = a.toLowerCase();
				const bLower = b.toLowerCase();

				// First prioritize 'vegan' features
				if (aLower.includes('vegan') && !bLower.includes('vegan')) return -1; // 'vegan' comes first
				if (!aLower.includes('vegan') && bLower.includes('vegan')) return 1;  // 'vegan' comes first

				// Then prioritize 'vegetarian' features
				if (aLower.includes('vegetarisch') && !bLower.includes('vegetarisch')) return -1; // 'vegetarian' second
				if (!aLower.includes('vegetarisch') && bLower.includes('vegetarisch')) return 1;  // 'vegetarian' second

				// Otherwise maintain original order
				return 0;
			});
		});

		// Log the results to debug the sorting
		console.log(_servings);

		return _servings
	})
}
