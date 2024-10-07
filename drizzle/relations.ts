import { relations } from "drizzle-orm/relations";
import { payload_preferences, payload_preferences_rels, users, mensa_provider, mensa, serving_time, time_slot, recipes, servings, nutrient_units, nutrient_labels, payload_locked_documents, payload_locked_documents_rels, media, info, user_image_uploads, nutrient_values, nutrients, allergens, additives, features, recipes_rels, features_locales, nutrient_labels_locales, allergens_locales, additives_locales, recipes_locales } from "./schema";

export const payload_preferences_relsRelations = relations(payload_preferences_rels, ({one}) => ({
	payload_preference: one(payload_preferences, {
		fields: [payload_preferences_rels.parent_id],
		references: [payload_preferences.id]
	}),
	user: one(users, {
		fields: [payload_preferences_rels.users_id],
		references: [users.id]
	}),
}));

export const payload_preferencesRelations = relations(payload_preferences, ({many}) => ({
	payload_preferences_rels: many(payload_preferences_rels),
}));

export const usersRelations = relations(users, ({many}) => ({
	payload_preferences_rels: many(payload_preferences_rels),
	payload_locked_documents_rels: many(payload_locked_documents_rels),
}));

export const mensaRelations = relations(mensa, ({one, many}) => ({
	mensa_provider: one(mensa_provider, {
		fields: [mensa.provider_id],
		references: [mensa_provider.id]
	}),
	serving_times: many(serving_time),
	servings: many(servings),
	payload_locked_documents_rels: many(payload_locked_documents_rels),
}));

export const mensa_providerRelations = relations(mensa_provider, ({many}) => ({
	mensas: many(mensa),
	recipes: many(recipes),
	payload_locked_documents_rels: many(payload_locked_documents_rels),
	features: many(features),
}));

export const serving_timeRelations = relations(serving_time, ({one, many}) => ({
	mensa: one(mensa, {
		fields: [serving_time.mensa_info_id],
		references: [mensa.id]
	}),
	time_slots: many(time_slot),
	payload_locked_documents_rels: many(payload_locked_documents_rels),
}));

export const time_slotRelations = relations(time_slot, ({one, many}) => ({
	serving_time: one(serving_time, {
		fields: [time_slot.serving_time_id],
		references: [serving_time.id]
	}),
	payload_locked_documents_rels: many(payload_locked_documents_rels),
}));

export const servingsRelations = relations(servings, ({one, many}) => ({
	recipe: one(recipes, {
		fields: [servings.recipe_id],
		references: [recipes.id]
	}),
	mensa: one(mensa, {
		fields: [servings.mensa_id],
		references: [mensa.id]
	}),
	payload_locked_documents_rels: many(payload_locked_documents_rels),
}));

export const recipesRelations = relations(recipes, ({one, many}) => ({
	servings: many(servings),
	mensa_provider: one(mensa_provider, {
		fields: [recipes.mensa_provider_id],
		references: [mensa_provider.id]
	}),
	payload_locked_documents_rels: many(payload_locked_documents_rels),
	nutrients: many(nutrients),
	user_image_uploads: many(user_image_uploads),
	recipes_rels: many(recipes_rels),
	recipes_locales: many(recipes_locales),
}));

export const nutrient_labelsRelations = relations(nutrient_labels, ({one, many}) => ({
	nutrient_unit: one(nutrient_units, {
		fields: [nutrient_labels.unit_id],
		references: [nutrient_units.id]
	}),
	payload_locked_documents_rels: many(payload_locked_documents_rels),
	nutrients: many(nutrients),
	nutrient_labels_locales: many(nutrient_labels_locales),
}));

export const nutrient_unitsRelations = relations(nutrient_units, ({many}) => ({
	nutrient_labels: many(nutrient_labels),
	payload_locked_documents_rels: many(payload_locked_documents_rels),
}));

export const payload_locked_documents_relsRelations = relations(payload_locked_documents_rels, ({one}) => ({
	payload_locked_document: one(payload_locked_documents, {
		fields: [payload_locked_documents_rels.parent_id],
		references: [payload_locked_documents.id]
	}),
	user: one(users, {
		fields: [payload_locked_documents_rels.users_id],
		references: [users.id]
	}),
	media: one(media, {
		fields: [payload_locked_documents_rels.media_id],
		references: [media.id]
	}),
	serving_time: one(serving_time, {
		fields: [payload_locked_documents_rels.serving_time_id],
		references: [serving_time.id]
	}),
	time_slot: one(time_slot, {
		fields: [payload_locked_documents_rels.time_slot_id],
		references: [time_slot.id]
	}),
	info: one(info, {
		fields: [payload_locked_documents_rels.info_id],
		references: [info.id]
	}),
	mensa: one(mensa, {
		fields: [payload_locked_documents_rels.mensa_id],
		references: [mensa.id]
	}),
	mensa_provider: one(mensa_provider, {
		fields: [payload_locked_documents_rels.mensa_provider_id],
		references: [mensa_provider.id]
	}),
	user_image_upload: one(user_image_uploads, {
		fields: [payload_locked_documents_rels.user_image_uploads_id],
		references: [user_image_uploads.id]
	}),
	nutrient_unit: one(nutrient_units, {
		fields: [payload_locked_documents_rels.nutrient_units_id],
		references: [nutrient_units.id]
	}),
	nutrient_label: one(nutrient_labels, {
		fields: [payload_locked_documents_rels.nutrient_labels_id],
		references: [nutrient_labels.id]
	}),
	nutrient_value: one(nutrient_values, {
		fields: [payload_locked_documents_rels.nutrient_values_id],
		references: [nutrient_values.id]
	}),
	nutrient: one(nutrients, {
		fields: [payload_locked_documents_rels.nutrients_id],
		references: [nutrients.id]
	}),
	recipe: one(recipes, {
		fields: [payload_locked_documents_rels.recipes_id],
		references: [recipes.id]
	}),
	allergen: one(allergens, {
		fields: [payload_locked_documents_rels.allergens_id],
		references: [allergens.id]
	}),
	additive: one(additives, {
		fields: [payload_locked_documents_rels.additives_id],
		references: [additives.id]
	}),
	serving: one(servings, {
		fields: [payload_locked_documents_rels.servings_id],
		references: [servings.id]
	}),
	feature: one(features, {
		fields: [payload_locked_documents_rels.features_id],
		references: [features.id]
	}),
}));

export const payload_locked_documentsRelations = relations(payload_locked_documents, ({many}) => ({
	payload_locked_documents_rels: many(payload_locked_documents_rels),
}));

export const mediaRelations = relations(media, ({many}) => ({
	payload_locked_documents_rels: many(payload_locked_documents_rels),
	user_image_uploads: many(user_image_uploads),
}));

export const infoRelations = relations(info, ({many}) => ({
	payload_locked_documents_rels: many(payload_locked_documents_rels),
}));

export const user_image_uploadsRelations = relations(user_image_uploads, ({one, many}) => ({
	payload_locked_documents_rels: many(payload_locked_documents_rels),
	media: one(media, {
		fields: [user_image_uploads.image_id],
		references: [media.id]
	}),
	recipe: one(recipes, {
		fields: [user_image_uploads.recipe_id],
		references: [recipes.id]
	}),
}));

export const nutrient_valuesRelations = relations(nutrient_values, ({many}) => ({
	payload_locked_documents_rels: many(payload_locked_documents_rels),
	nutrients: many(nutrients),
}));

export const nutrientsRelations = relations(nutrients, ({one, many}) => ({
	payload_locked_documents_rels: many(payload_locked_documents_rels),
	nutrient_value: one(nutrient_values, {
		fields: [nutrients.nutrient_value_id],
		references: [nutrient_values.id]
	}),
	nutrient_label: one(nutrient_labels, {
		fields: [nutrients.nutrient_label_id],
		references: [nutrient_labels.id]
	}),
	recipe: one(recipes, {
		fields: [nutrients.recipe_id],
		references: [recipes.id]
	}),
}));

export const allergensRelations = relations(allergens, ({many}) => ({
	payload_locked_documents_rels: many(payload_locked_documents_rels),
	recipes_rels: many(recipes_rels),
	allergens_locales: many(allergens_locales),
}));

export const additivesRelations = relations(additives, ({many}) => ({
	payload_locked_documents_rels: many(payload_locked_documents_rels),
	recipes_rels: many(recipes_rels),
	additives_locales: many(additives_locales),
}));

export const featuresRelations = relations(features, ({one, many}) => ({
	payload_locked_documents_rels: many(payload_locked_documents_rels),
	recipes_rels: many(recipes_rels),
	features_locales: many(features_locales),
	mensa_provider: one(mensa_provider, {
		fields: [features.mensa_provider_id],
		references: [mensa_provider.id]
	}),
}));

export const recipes_relsRelations = relations(recipes_rels, ({one}) => ({
	recipe: one(recipes, {
		fields: [recipes_rels.parent_id],
		references: [recipes.id]
	}),
	additive: one(additives, {
		fields: [recipes_rels.additives_id],
		references: [additives.id]
	}),
	allergen: one(allergens, {
		fields: [recipes_rels.allergens_id],
		references: [allergens.id]
	}),
	feature: one(features, {
		fields: [recipes_rels.features_id],
		references: [features.id]
	}),
}));

export const features_localesRelations = relations(features_locales, ({one}) => ({
	feature: one(features, {
		fields: [features_locales._parent_id],
		references: [features.id]
	}),
}));

export const nutrient_labels_localesRelations = relations(nutrient_labels_locales, ({one}) => ({
	nutrient_label: one(nutrient_labels, {
		fields: [nutrient_labels_locales._parent_id],
		references: [nutrient_labels.id]
	}),
}));

export const allergens_localesRelations = relations(allergens_locales, ({one}) => ({
	allergen: one(allergens, {
		fields: [allergens_locales._parent_id],
		references: [allergens.id]
	}),
}));

export const additives_localesRelations = relations(additives_locales, ({one}) => ({
	additive: one(additives, {
		fields: [additives_locales._parent_id],
		references: [additives.id]
	}),
}));

export const recipes_localesRelations = relations(recipes_locales, ({one}) => ({
	recipe: one(recipes, {
		fields: [recipes_locales._parent_id],
		references: [recipes.id]
	}),
}));