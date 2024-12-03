import { relations } from "drizzle-orm/relations";
import { mensaProvider, mensa, servingTime, timeSlot, media, recipes, servings, nutrientValues, nutrients, nutrientLabels, nutrientUnits, nutrientLabelsLocales, allergens, allergensLocales, additives, additivesLocales, recipesRels, features, userImageUploads, payloadLockedDocuments, payloadLockedDocumentsRels, users, info, locale, payloadPreferences, payloadPreferencesRels, localeRels } from "./schema";

export const mensaRelations = relations(mensa, ({one, many}) => ({
	mensaProvider: one(mensaProvider, {
		fields: [mensa.providerId],
		references: [mensaProvider.id]
	}),
	servingTimes: many(servingTime),
	servings: many(servings),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const mensaProviderRelations = relations(mensaProvider, ({many}) => ({
	mensas: many(mensa),
	recipes: many(recipes),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const servingTimeRelations = relations(servingTime, ({one, many}) => ({
	mensa: one(mensa, {
		fields: [servingTime.mensaInfoId],
		references: [mensa.id]
	}),
	timeSlots: many(timeSlot),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const timeSlotRelations = relations(timeSlot, ({one, many}) => ({
	servingTime: one(servingTime, {
		fields: [timeSlot.servingTimeId],
		references: [servingTime.id]
	}),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const recipesRelations = relations(recipes, ({one, many}) => ({
	media: one(media, {
		fields: [recipes.aiThumbnailId],
		references: [media.id]
	}),
	mensaProvider: one(mensaProvider, {
		fields: [recipes.mensaProviderId],
		references: [mensaProvider.id]
	}),
	servings: many(servings),
	nutrients: many(nutrients),
	recipesRels: many(recipesRels),
	userImageUploads: many(userImageUploads),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
	localeRels: many(localeRels),
}));

export const mediaRelations = relations(media, ({many}) => ({
	recipes: many(recipes),
	userImageUploads: many(userImageUploads),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const servingsRelations = relations(servings, ({one, many}) => ({
	recipe: one(recipes, {
		fields: [servings.recipeId],
		references: [recipes.id]
	}),
	mensa: one(mensa, {
		fields: [servings.mensaId],
		references: [mensa.id]
	}),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const nutrientsRelations = relations(nutrients, ({one, many}) => ({
	nutrientValue: one(nutrientValues, {
		fields: [nutrients.nutrientValueId],
		references: [nutrientValues.id]
	}),
	nutrientLabel: one(nutrientLabels, {
		fields: [nutrients.nutrientLabelId],
		references: [nutrientLabels.id]
	}),
	recipe: one(recipes, {
		fields: [nutrients.recipeId],
		references: [recipes.id]
	}),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const nutrientValuesRelations = relations(nutrientValues, ({many}) => ({
	nutrients: many(nutrients),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const nutrientLabelsRelations = relations(nutrientLabels, ({one, many}) => ({
	nutrients: many(nutrients),
	nutrientUnit: one(nutrientUnits, {
		fields: [nutrientLabels.unitId],
		references: [nutrientUnits.id]
	}),
	nutrientLabelsLocales: many(nutrientLabelsLocales),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const nutrientUnitsRelations = relations(nutrientUnits, ({many}) => ({
	nutrientLabels: many(nutrientLabels),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const nutrientLabelsLocalesRelations = relations(nutrientLabelsLocales, ({one}) => ({
	nutrientLabel: one(nutrientLabels, {
		fields: [nutrientLabelsLocales.parentId],
		references: [nutrientLabels.id]
	}),
}));

export const allergensLocalesRelations = relations(allergensLocales, ({one}) => ({
	allergen: one(allergens, {
		fields: [allergensLocales.parentId],
		references: [allergens.id]
	}),
}));

export const allergensRelations = relations(allergens, ({many}) => ({
	allergensLocales: many(allergensLocales),
	recipesRels: many(recipesRels),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
	localeRels: many(localeRels),
}));

export const additivesLocalesRelations = relations(additivesLocales, ({one}) => ({
	additive: one(additives, {
		fields: [additivesLocales.parentId],
		references: [additives.id]
	}),
}));

export const additivesRelations = relations(additives, ({many}) => ({
	additivesLocales: many(additivesLocales),
	recipesRels: many(recipesRels),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
	localeRels: many(localeRels),
}));

export const recipesRelsRelations = relations(recipesRels, ({one}) => ({
	recipe: one(recipes, {
		fields: [recipesRels.parentId],
		references: [recipes.id]
	}),
	feature: one(features, {
		fields: [recipesRels.featuresId],
		references: [features.id]
	}),
	additive: one(additives, {
		fields: [recipesRels.additivesId],
		references: [additives.id]
	}),
	allergen: one(allergens, {
		fields: [recipesRels.allergensId],
		references: [allergens.id]
	}),
}));

export const featuresRelations = relations(features, ({many}) => ({
	recipesRels: many(recipesRels),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
	localeRels: many(localeRels),
}));

export const userImageUploadsRelations = relations(userImageUploads, ({one, many}) => ({
	media: one(media, {
		fields: [userImageUploads.imageId],
		references: [media.id]
	}),
	recipe: one(recipes, {
		fields: [userImageUploads.recipeId],
		references: [recipes.id]
	}),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const payloadLockedDocumentsRelsRelations = relations(payloadLockedDocumentsRels, ({one}) => ({
	payloadLockedDocument: one(payloadLockedDocuments, {
		fields: [payloadLockedDocumentsRels.parentId],
		references: [payloadLockedDocuments.id]
	}),
	user: one(users, {
		fields: [payloadLockedDocumentsRels.usersId],
		references: [users.id]
	}),
	media: one(media, {
		fields: [payloadLockedDocumentsRels.mediaId],
		references: [media.id]
	}),
	mensaProvider: one(mensaProvider, {
		fields: [payloadLockedDocumentsRels.mensaProviderId],
		references: [mensaProvider.id]
	}),
	mensa: one(mensa, {
		fields: [payloadLockedDocumentsRels.mensaId],
		references: [mensa.id]
	}),
	servingTime: one(servingTime, {
		fields: [payloadLockedDocumentsRels.servingTimeId],
		references: [servingTime.id]
	}),
	timeSlot: one(timeSlot, {
		fields: [payloadLockedDocumentsRels.timeSlotId],
		references: [timeSlot.id]
	}),
	serving: one(servings, {
		fields: [payloadLockedDocumentsRels.servingsId],
		references: [servings.id]
	}),
	info: one(info, {
		fields: [payloadLockedDocumentsRels.infoId],
		references: [info.id]
	}),
	nutrient: one(nutrients, {
		fields: [payloadLockedDocumentsRels.nutrientsId],
		references: [nutrients.id]
	}),
	nutrientUnit: one(nutrientUnits, {
		fields: [payloadLockedDocumentsRels.nutrientUnitsId],
		references: [nutrientUnits.id]
	}),
	nutrientLabel: one(nutrientLabels, {
		fields: [payloadLockedDocumentsRels.nutrientLabelsId],
		references: [nutrientLabels.id]
	}),
	nutrientValue: one(nutrientValues, {
		fields: [payloadLockedDocumentsRels.nutrientValuesId],
		references: [nutrientValues.id]
	}),
	allergen: one(allergens, {
		fields: [payloadLockedDocumentsRels.allergensId],
		references: [allergens.id]
	}),
	additive: one(additives, {
		fields: [payloadLockedDocumentsRels.additivesId],
		references: [additives.id]
	}),
	recipe: one(recipes, {
		fields: [payloadLockedDocumentsRels.recipesId],
		references: [recipes.id]
	}),
	userImageUpload: one(userImageUploads, {
		fields: [payloadLockedDocumentsRels.userImageUploadsId],
		references: [userImageUploads.id]
	}),
	feature: one(features, {
		fields: [payloadLockedDocumentsRels.featuresId],
		references: [features.id]
	}),
	locale: one(locale, {
		fields: [payloadLockedDocumentsRels.localeId],
		references: [locale.id]
	}),
}));

export const payloadLockedDocumentsRelations = relations(payloadLockedDocuments, ({many}) => ({
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const usersRelations = relations(users, ({many}) => ({
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
	payloadPreferencesRels: many(payloadPreferencesRels),
}));

export const infoRelations = relations(info, ({many}) => ({
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const localeRelations = relations(locale, ({many}) => ({
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
	localeRels: many(localeRels),
}));

export const payloadPreferencesRelsRelations = relations(payloadPreferencesRels, ({one}) => ({
	payloadPreference: one(payloadPreferences, {
		fields: [payloadPreferencesRels.parentId],
		references: [payloadPreferences.id]
	}),
	user: one(users, {
		fields: [payloadPreferencesRels.usersId],
		references: [users.id]
	}),
}));

export const payloadPreferencesRelations = relations(payloadPreferences, ({many}) => ({
	payloadPreferencesRels: many(payloadPreferencesRels),
}));

export const localeRelsRelations = relations(localeRels, ({one}) => ({
	allergen: one(allergens, {
		fields: [localeRels.allergensId],
		references: [allergens.id]
	}),
	additive: one(additives, {
		fields: [localeRels.additivesId],
		references: [additives.id]
	}),
	locale: one(locale, {
		fields: [localeRels.parentId],
		references: [locale.id]
	}),
	recipe: one(recipes, {
		fields: [localeRels.recipesId],
		references: [recipes.id]
	}),
	feature: one(features, {
		fields: [localeRels.featuresId],
		references: [features.id]
	}),
}));