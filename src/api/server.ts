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

type Feature = typeof features.$inferSelect

export type Recipe = {
	name: string
	id: number
	price: {
		students?: number
		employees?: number
		guests?: number
	}
	features: Array<{
		id: number
		name: string
		visibleSmall: boolean
	}>
	nutrients: {
		docs: Array<any>
		hasNextPage: boolean
	}
	allergens: Array<any>
	additives: Array<any>
	aiThumbnail?: {
		id: number
		alt: string
		updatedAt: string
		createdAt: string
		url: string
		thumbnailURL: any
		filename: string
		mimeType: string
		filesize: number
		width: number
		height: number
		focalX: number
		focalY: number
	}
}

export async function getServings(
	mensaSlug: string,
	date: string,
	language: 'en' | 'de',
) {
	return withServerActionInstrumentation('getServings', async () => {
		if (!mensaSlug) return
		const hubUrlString = process.env.HUB_URL
		if (!hubUrlString) {
			throw new Error('HUB_URL is not defined')
		}
		const hubUrl = new URL(hubUrlString)

		console.log(date)

		const servingsReq = await fetch(`${hubUrl.origin}/api/mensa/${mensaSlug}/servings/${date}`)

		if (!servingsReq.ok) {
			return []
		}

		const servings = await servingsReq.json() as {
			servings: {
				id: number,
				date: string,
				recipe: Recipe
			}[]
		}
		// console.dir(servings, { depth: Infinity })

		return servings.servings
	})
}
