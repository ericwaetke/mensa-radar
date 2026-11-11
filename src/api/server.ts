'use server'
import { redirect } from '@solidjs/router'
import { useSession } from 'vinxi/http'
import { aliasedTable, and, asc, eq, InferSelectModel, inArray, isNull, like, or } from 'drizzle-orm'
import { db } from './db'
import {
	additives,
	allergens,
	features,
	mensa,
	mensaProvider,
	mensaRels,
	openingDay,
	recipes,
	recipesRels,
	servings,
	locale,
	localeRels
} from '../../drizzle/schema'
import { sql } from 'drizzle-orm'
import { withServerActionInstrumentation } from '@sentry/solidstart'

export type OpeningDayRow = typeof openingDay.$inferSelect

/** A mensa row of the provider join with its shared opening days attached. */
export type MensaRow = {
	mensa: typeof mensa.$inferSelect
	mensa_provider: typeof mensaProvider.$inferSelect
	openingDays: OpeningDayRow[]
}

/**
 * All opening days for the given mensas, ordered by weekday order and
 * grouped by mensa. Empty map entry = no data / closed all week.
 */
async function openingDaysForMensas(mensaIds: number[]) {
	const grouped = new Map<number, OpeningDayRow[]>()
	if (mensaIds.length === 0) return grouped

	const rows = await db
		.select({ mensaId: mensaRels.parentId, day: openingDay })
		.from(mensaRels)
		.innerJoin(openingDay, eq(mensaRels.openingDayId, openingDay.id))
		.where(
			and(
				eq(mensaRels.path, 'opening_days'),
				inArray(mensaRels.parentId, mensaIds),
			),
		)
		.orderBy(asc(mensaRels.order))

	for (const row of rows) {
		const days = grouped.get(row.mensaId) ?? []
		days.push(row.day)
		grouped.set(row.mensaId, days)
	}
	return grouped
}

export async function getMensas() {
	return withServerActionInstrumentation('getMensas', async () => {
		const mensas = await db
			.select()
			.from(mensaProvider)
			.innerJoin(
				mensa,
				eq(mensaProvider.id, mensa.providerId),
			)

		const openingDays = await openingDaysForMensas(
			mensas.map((row) => row.mensa.id),
		)

		const sortedAfterProvider = new Map<string, MensaRow[]>()
		for (const mensa of mensas) {
			const provider = mensa.mensa_provider
			if (!provider) throw new Error('Provider slug is missing')
			if (!provider.slug) continue

			if (!sortedAfterProvider.has(provider.slug)) {
				sortedAfterProvider.set(provider.slug, [])
			}
			sortedAfterProvider.get(provider.slug)!.push({
				...mensa,
				openingDays: openingDays.get(mensa.mensa.id) ?? [],
			})
		}

		return sortedAfterProvider
	})
}

/**
 * Solid router params arrive URL-encoded (e.g. "Neues%20Palais"), while the
 * slug column stores the decoded name. Decode defensively so slugs with
 * spaces or umlauts match as well.
 */
function decodeSlug(slug: string): string {
	try {
		return decodeURIComponent(slug)
	} catch {
		return slug
	}
}

export async function getMensa(slug: string) {
	return withServerActionInstrumentation('getMensa', async () => {
		const res = await db
			.select()
			.from(mensa)
			.where(eq(mensa.slug, decodeSlug(slug)))
			.innerJoin(
				mensaProvider,
				eq(mensa.providerId, mensaProvider.id),
			)
			.limit(1)

		const row = res[0]
		if (!row) return row

		const openingDays = await openingDaysForMensas([row.mensa.id])
		return {
			...row,
			openingDays: openingDays.get(row.mensa.id) ?? [],
		}
	})
}

type Feature = typeof features.$inferSelect

export type Nutrient = {
	id: number
	label: string
	unit: string
	value: number
}

export type LabeledEntity = {
	id: number
	name: string
}

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
	nutrients: Nutrient[]
	allergens: LabeledEntity[]
	additives: LabeledEntity[]
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
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
			throw new Error(
				`getServings: "${date}" is not a YYYY-MM-DD date`,
			)
		}
		const hubUrlString = process.env.HUB_URL
		if (!hubUrlString) {
			throw new Error('HUB_URL is not defined')
		}
		const hubUrl = new URL(hubUrlString)

		// Normalize (router params may be URL-encoded) and encode for the URL path
		const servingsReq = await fetch(
			`${hubUrl.origin}/api/mensa/${encodeURIComponent(decodeSlug(mensaSlug))}/servings/${date}`,
		)

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
