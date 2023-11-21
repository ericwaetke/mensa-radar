import { relations } from "drizzle-orm"
import {
	bigint,
	boolean,
	date,
	json,
	jsonb,
	pgTable,
	real,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core"

export const mensen = pgTable("mensen", {
	id: serial("id"),
	createdAt: timestamp("created_at"),
	name: text("name"),
	locLong: varchar("loc_long"),
	locLat: varchar("loc_lat"),
	url: varchar("url"),
})
export const mensenRelations = relations(mensen, ({ one, many }) => ({
	foodOfferings: many(foodOfferings),
	currentMensaData: one(currentMensaData, {
		fields: [mensen.id],
		references: [currentMensaData.mensaId],
	}),
}))

export const currentMensaData = pgTable("current_mensa_data", {
	id: serial("id"),
	createdAt: timestamp("created_at"),
	mensaId: bigint("mensa", { mode: "number" }),
	open: boolean("open"),
	daysWithFood: json("daysWithFood"),
	openingTimes: json("openingTimes"),
	enabled: boolean("enabled"),
})
export const currentMensaDataRelations = relations(
	currentMensaData,
	({ one }) => ({
		mensa: one(mensen, {
			fields: [currentMensaData.mensaId],
			references: [mensen.id],
		}),
	})
)

export const foodOfferings = pgTable("food_offerings", {
	id: serial("id"),
	createdAt: timestamp("created_at"),
	mensa: bigint("mensa", { mode: "number" }),
	date: timestamp("date"),
	foodTitle: text("food_title"),
	foodTitleEn: text("food_title_eng"),
	foodDescription: text("food_desc"),
	vegan: boolean("vegan"),
	vegetarian: boolean("vegetarian"),
	fish: boolean("fish"),
	meat: boolean("meat"),
	nutrients: json("nutrients"),
	allergens: json("allergens"),
	priceStudents: real("price_students"),
	priceOther: real("price_other"),
	soldOut: boolean("sold_out"),
	changedAt: timestamp("changed_at"),
	hasAiThumbnail: boolean("has_ai_thumbnail"),
	blurhash: text("blurhash"),
})
export const foodIfferingsRelations = relations(
	foodOfferings,
	({ one, many }) => ({
		qualityReviews: many(qualityReviews),
		foodImages: many(foodImages),
		mensa: one(mensen, {
			fields: [foodOfferings.mensa],
			references: [mensen.id],
		}),
	})
)

export const qualityReviews = pgTable("quality_reviews", {
	id: serial("id"),
	createdAt: timestamp("created_at"),
	offerId: bigint("offerId", { mode: "number" }),
	userSessionId: varchar("userSessionId"),
	rating: real("rating"),
})
export const qualityReviewsRelations = relations(qualityReviews, ({ one }) => ({
	foodOfferings: one(foodOfferings, {
		fields: [qualityReviews.offerId],
		references: [foodOfferings.id],
	}),
}))

export const foodImages = pgTable("food_images", {
	id: serial("id"),
	createdAt: timestamp("created_at"),
	foodId: bigint("food_id", { mode: "number" }),
	imageUrl: text("image_url"),
	imageName: text("image_name"),
})
export const foodImagesRelations = relations(foodImages, ({ one }) => ({
	foodOfferings: one(foodOfferings, {
		fields: [foodImages.foodId],
		references: [foodOfferings.id],
	}),
}))

export const getMensen = pgTable("get_mensen", {
	mensa: bigint("mensa", { mode: "number" }),
	nextFood: date("next_food"),
	name: text("name"),
	url: varchar("url"),
	locLong: varchar("loc_long"),
	locLat: varchar("loc_lat"),
	openingTimes: jsonb("opening_times"),
	enabled: boolean("enabled"),
})
