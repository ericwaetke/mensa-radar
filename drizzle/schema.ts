import { pgTable, index, serial, varchar, numeric, timestamp, foreignKey, integer, uniqueIndex, unique, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const locales = pgEnum("_locales", ['de', 'en'])
export const enumLocaleLocale = pgEnum("enum_locale_locale", ['de', 'en'])
export const enumServingTimeDay = pgEnum("enum_serving_time_day", ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])


export const payloadMigrations = pgTable("payload_migrations", {
  id: serial().primaryKey().notNull(),
  name: varchar(),
  batch: numeric(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("payload_migrations_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    updatedAt1Idx: index("payload_migrations_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
  }
});

export const mensaProvider = pgTable("mensa_provider", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
  slug: varchar(),
  description: varchar().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("mensa_provider_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    slug1Idx: index("mensa_provider_slug_1_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
    updatedAt1Idx: index("mensa_provider_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
  }
});

export const mensa = pgTable("mensa", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
  slug: varchar(),
  addressLatitude: numeric("address_latitude").notNull(),
  addressLongitude: numeric("address_longitude").notNull(),
  addressStreet: varchar("address_street"),
  addressHouseNumber: varchar("address_house_number"),
  addressZipCode: varchar("address_zip_code"),
  addressCity: varchar("address_city"),
  description: varchar(),
  providerId: integer("provider_id").notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("mensa_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    provider1Idx: index("mensa_provider_1_idx").using("btree", table.providerId.asc().nullsLast().op("int4_ops")),
    slug1Idx: index("mensa_slug_1_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
    updatedAt1Idx: index("mensa_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
    mensaProviderIdMensaProviderIdFk: foreignKey({
      columns: [table.providerId],
      foreignColumns: [mensaProvider.id],
      name: "mensa_provider_id_mensa_provider_id_fk"
    }).onDelete("set null"),
  }
});

export const servingTime = pgTable("serving_time", {
  id: serial().primaryKey().notNull(),
  mensaInfoId: integer("mensa_info_id"),
  day: enumServingTimeDay(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("serving_time_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    mensaInfo1Idx: index("serving_time_mensa_info_1_idx").using("btree", table.mensaInfoId.asc().nullsLast().op("int4_ops")),
    updatedAt1Idx: index("serving_time_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
    servingTimeMensaInfoIdMensaIdFk: foreignKey({
      columns: [table.mensaInfoId],
      foreignColumns: [mensa.id],
      name: "serving_time_mensa_info_id_mensa_id_fk"
    }).onDelete("set null"),
  }
});

export const timeSlot = pgTable("time_slot", {
  id: serial().primaryKey().notNull(),
  servingTimeId: integer("serving_time_id"),
  from: timestamp({ precision: 3, withTimezone: true, mode: 'string' }).notNull(),
  to: timestamp({ precision: 3, withTimezone: true, mode: 'string' }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("time_slot_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    servingTime1Idx: index("time_slot_serving_time_1_idx").using("btree", table.servingTimeId.asc().nullsLast().op("int4_ops")),
    updatedAt1Idx: index("time_slot_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
    timeSlotServingTimeIdServingTimeIdFk: foreignKey({
      columns: [table.servingTimeId],
      foreignColumns: [servingTime.id],
      name: "time_slot_serving_time_id_serving_time_id_fk"
    }).onDelete("set null"),
  }
});

export const recipes = pgTable("recipes", {
  id: serial().primaryKey().notNull(),
  aiThumbnailId: integer("ai_thumbnail_id"),
  priceStudents: numeric("price_students"),
  priceEmployees: numeric("price_employees"),
  priceGuests: numeric("price_guests"),
  mensaProviderId: integer("mensa_provider_id").notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    aiThumbnail1Idx: index("recipes_ai_thumbnail_1_idx").using("btree", table.aiThumbnailId.asc().nullsLast().op("int4_ops")),
    createdAt1Idx: index("recipes_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    mensaProvider1Idx: index("recipes_mensa_provider_1_idx").using("btree", table.mensaProviderId.asc().nullsLast().op("int4_ops")),
    updatedAt1Idx: index("recipes_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
    recipesAiThumbnailIdMediaIdFk: foreignKey({
      columns: [table.aiThumbnailId],
      foreignColumns: [media.id],
      name: "recipes_ai_thumbnail_id_media_id_fk"
    }).onDelete("set null"),
    recipesMensaProviderIdMensaProviderIdFk: foreignKey({
      columns: [table.mensaProviderId],
      foreignColumns: [mensaProvider.id],
      name: "recipes_mensa_provider_id_mensa_provider_id_fk"
    }).onDelete("set null"),
  }
});

export const servings = pgTable("servings", {
  id: serial().primaryKey().notNull(),
  recipeId: integer("recipe_id").notNull(),
  date: timestamp({ precision: 3, withTimezone: true, mode: 'string' }).notNull(),
  mensaId: integer("mensa_id"),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("servings_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    mensa1Idx: index("servings_mensa_1_idx").using("btree", table.mensaId.asc().nullsLast().op("int4_ops")),
    recipe1Idx: index("servings_recipe_1_idx").using("btree", table.recipeId.asc().nullsLast().op("int4_ops")),
    updatedAt1Idx: index("servings_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
    servingsRecipeIdRecipesIdFk: foreignKey({
      columns: [table.recipeId],
      foreignColumns: [recipes.id],
      name: "servings_recipe_id_recipes_id_fk"
    }).onDelete("set null"),
    servingsMensaIdMensaIdFk: foreignKey({
      columns: [table.mensaId],
      foreignColumns: [mensa.id],
      name: "servings_mensa_id_mensa_id_fk"
    }).onDelete("set null"),
  }
});

export const nutrientValues = pgTable("nutrient_values", {
  id: serial().primaryKey().notNull(),
  value: numeric(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("nutrient_values_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    updatedAt1Idx: index("nutrient_values_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
    value1Idx: uniqueIndex("nutrient_values_value_1_idx").using("btree", table.value.asc().nullsLast().op("numeric_ops")),
  }
});

export const nutrients = pgTable("nutrients", {
  id: serial().primaryKey().notNull(),
  nutrientValueId: integer("nutrient_value_id"),
  nutrientLabelId: integer("nutrient_label_id"),
  recipeId: integer("recipe_id"),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("nutrients_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    nutrientLabel1Idx: index("nutrients_nutrient_label_1_idx").using("btree", table.nutrientLabelId.asc().nullsLast().op("int4_ops")),
    nutrientValue1Idx: index("nutrients_nutrient_value_1_idx").using("btree", table.nutrientValueId.asc().nullsLast().op("int4_ops")),
    recipe1Idx: index("nutrients_recipe_1_idx").using("btree", table.recipeId.asc().nullsLast().op("int4_ops")),
    updatedAt1Idx: index("nutrients_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
    nutrientsNutrientValueIdNutrientValuesIdFk: foreignKey({
      columns: [table.nutrientValueId],
      foreignColumns: [nutrientValues.id],
      name: "nutrients_nutrient_value_id_nutrient_values_id_fk"
    }).onDelete("set null"),
    nutrientsNutrientLabelIdNutrientLabelsIdFk: foreignKey({
      columns: [table.nutrientLabelId],
      foreignColumns: [nutrientLabels.id],
      name: "nutrients_nutrient_label_id_nutrient_labels_id_fk"
    }).onDelete("set null"),
    nutrientsRecipeIdRecipesIdFk: foreignKey({
      columns: [table.recipeId],
      foreignColumns: [recipes.id],
      name: "nutrients_recipe_id_recipes_id_fk"
    }).onDelete("set null"),
  }
});

export const nutrientLabels = pgTable("nutrient_labels", {
  id: serial().primaryKey().notNull(),
  unitId: integer("unit_id").notNull(),
  recommendation: varchar(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("nutrient_labels_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    unit1Idx: index("nutrient_labels_unit_1_idx").using("btree", table.unitId.asc().nullsLast().op("int4_ops")),
    updatedAt1Idx: index("nutrient_labels_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
    nutrientLabelsUnitIdNutrientUnitsIdFk: foreignKey({
      columns: [table.unitId],
      foreignColumns: [nutrientUnits.id],
      name: "nutrient_labels_unit_id_nutrient_units_id_fk"
    }).onDelete("set null"),
  }
});

export const nutrientUnits = pgTable("nutrient_units", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("nutrient_units_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    name1Idx: uniqueIndex("nutrient_units_name_1_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
    updatedAt1Idx: index("nutrient_units_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
  }
});

export const nutrientLabelsLocales = pgTable("nutrient_labels_locales", {
  name: varchar().notNull(),
  id: serial().primaryKey().notNull(),
  locale: locales("_locale").notNull(),
  parentId: integer("_parent_id").notNull(),
}, (table) => {
  return {
    nutrientLabelsName1Idx: uniqueIndex("nutrient_labels_name_1_idx").using("btree", table.name.asc().nullsLast().op("text_ops"), table.locale.asc().nullsLast().op("text_ops")),
    nutrientLabelsLocalesParentIdFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [nutrientLabels.id],
      name: "nutrient_labels_locales_parent_id_fk"
    }).onDelete("cascade"),
    nutrientLabelsLocalesLocaleParentIdUnique: unique("nutrient_labels_locales_locale_parent_id_unique").on(table.locale, table.parentId),
  }
});

export const allergens = pgTable("allergens", {
  id: serial().primaryKey().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("allergens_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    updatedAt1Idx: index("allergens_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
  }
});

export const allergensLocales = pgTable("allergens_locales", {
  name: varchar(),
  id: serial().primaryKey().notNull(),
  locale: locales("_locale").notNull(),
  parentId: integer("_parent_id").notNull(),
}, (table) => {
  return {
    allergensLocalesParentIdFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [allergens.id],
      name: "allergens_locales_parent_id_fk"
    }).onDelete("cascade"),
    allergensLocalesLocaleParentIdUnique: unique("allergens_locales_locale_parent_id_unique").on(table.locale, table.parentId),
  }
});

export const additives = pgTable("additives", {
  id: serial().primaryKey().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("additives_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    updatedAt1Idx: index("additives_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
  }
});

export const additivesLocales = pgTable("additives_locales", {
  name: varchar(),
  id: serial().primaryKey().notNull(),
  locale: locales("_locale").notNull(),
  parentId: integer("_parent_id").notNull(),
}, (table) => {
  return {
    additivesLocalesParentIdFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [additives.id],
      name: "additives_locales_parent_id_fk"
    }).onDelete("cascade"),
    additivesLocalesLocaleParentIdUnique: unique("additives_locales_locale_parent_id_unique").on(table.locale, table.parentId),
  }
});

export const media = pgTable("media", {
  id: serial().primaryKey().notNull(),
  alt: varchar().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  url: varchar(),
  thumbnailURL: varchar("thumbnail_u_r_l"),
  filename: varchar(),
  mimeType: varchar("mime_type"),
  filesize: numeric(),
  width: numeric(),
  height: numeric(),
  focalX: numeric("focal_x"),
  focalY: numeric("focal_y"),
}, (table) => {
  return {
    createdAt1Idx: index("media_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    filename1Idx: uniqueIndex("media_filename_1_idx").using("btree", table.filename.asc().nullsLast().op("text_ops")),
    updatedAt1Idx: index("media_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
  }
});

export const recipesRels = pgTable("recipes_rels", {
  id: serial().primaryKey().notNull(),
  order: integer(),
  parentId: integer("parent_id").notNull(),
  path: varchar().notNull(),
  featuresId: integer("features_id"),
  additivesId: integer("additives_id"),
  allergensId: integer("allergens_id"),
}, (table) => {
  return {
    additivesId1Idx: index("recipes_rels_additives_id_1_idx").using("btree", table.additivesId.asc().nullsLast().op("int4_ops")),
    allergensId1Idx: index("recipes_rels_allergens_id_1_idx").using("btree", table.allergensId.asc().nullsLast().op("int4_ops")),
    featuresId1Idx: index("recipes_rels_features_id_1_idx").using("btree", table.featuresId.asc().nullsLast().op("int4_ops")),
    orderIdx: index("recipes_rels_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
    parentIdx: index("recipes_rels_parent_idx").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
    pathIdx: index("recipes_rels_path_idx").using("btree", table.path.asc().nullsLast().op("text_ops")),
    recipesRelsParentFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [recipes.id],
      name: "recipes_rels_parent_fk"
    }).onDelete("cascade"),
    recipesRelsFeaturesFk: foreignKey({
      columns: [table.featuresId],
      foreignColumns: [features.id],
      name: "recipes_rels_features_fk"
    }).onDelete("cascade"),
    recipesRelsAdditivesFk: foreignKey({
      columns: [table.additivesId],
      foreignColumns: [additives.id],
      name: "recipes_rels_additives_fk"
    }).onDelete("cascade"),
    recipesRelsAllergensFk: foreignKey({
      columns: [table.allergensId],
      foreignColumns: [allergens.id],
      name: "recipes_rels_allergens_fk"
    }).onDelete("cascade"),
  }
});

export const features = pgTable("features", {
  id: serial().primaryKey().notNull(),
  mensaProviderId: integer("mensa_provider_id"),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("features_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    mensaProvider1Idx: index("features_mensa_provider_1_idx").using("btree", table.mensaProviderId.asc().nullsLast().op("int4_ops")),
    updatedAt1Idx: index("features_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
    featuresMensaProviderIdMensaProviderIdFk: foreignKey({
      columns: [table.mensaProviderId],
      foreignColumns: [mensaProvider.id],
      name: "features_mensa_provider_id_mensa_provider_id_fk"
    }).onDelete("set null"),
  }
});

export const userImageUploads = pgTable("user_image_uploads", {
  id: serial().primaryKey().notNull(),
  imageId: integer("image_id").notNull(),
  uniqueUserId: varchar("unique_user_id").notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  recipeId: integer("recipe_id").notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    image1Idx: index("user_image_uploads_image_1_idx").using("btree", table.imageId.asc().nullsLast().op("int4_ops")),
    recipe1Idx: index("user_image_uploads_recipe_1_idx").using("btree", table.recipeId.asc().nullsLast().op("int4_ops")),
    updatedAt1Idx: index("user_image_uploads_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
    userImageUploadsImageIdMediaIdFk: foreignKey({
      columns: [table.imageId],
      foreignColumns: [media.id],
      name: "user_image_uploads_image_id_media_id_fk"
    }).onDelete("set null"),
    userImageUploadsRecipeIdRecipesIdFk: foreignKey({
      columns: [table.recipeId],
      foreignColumns: [recipes.id],
      name: "user_image_uploads_recipe_id_recipes_id_fk"
    }).onDelete("set null"),
  }
});

export const featuresLocales = pgTable("features_locales", {
  name: varchar(),
  id: serial().primaryKey().notNull(),
  locale: locales("_locale").notNull(),
  parentId: integer("_parent_id").notNull(),
}, (table) => {
  return {
    featuresLocalesParentIdFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [features.id],
      name: "features_locales_parent_id_fk"
    }).onDelete("cascade"),
    featuresLocalesLocaleParentIdUnique: unique("features_locales_locale_parent_id_unique").on(table.locale, table.parentId),
  }
});

export const locale = pgTable("locale", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
  locale: enumLocaleLocale().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("locale_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    updatedAt1Idx: index("locale_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
  }
});

export const localeRels = pgTable("locale_rels", {
  id: serial().primaryKey().notNull(),
  order: integer(),
  parentId: integer("parent_id").notNull(),
  path: varchar().notNull(),
  recipesId: integer("recipes_id"),
  featuresId: integer("features_id"),
}, (table) => {
  return {
    featuresId1Idx: index("locale_rels_features_id_1_idx").using("btree", table.featuresId.asc().nullsLast().op("int4_ops")),
    orderIdx: index("locale_rels_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
    parentIdx: index("locale_rels_parent_idx").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
    pathIdx: index("locale_rels_path_idx").using("btree", table.path.asc().nullsLast().op("text_ops")),
    recipesId1Idx: index("locale_rels_recipes_id_1_idx").using("btree", table.recipesId.asc().nullsLast().op("int4_ops")),
    localeRelsParentFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [locale.id],
      name: "locale_rels_parent_fk"
    }).onDelete("cascade"),
    localeRelsRecipesFk: foreignKey({
      columns: [table.recipesId],
      foreignColumns: [recipes.id],
      name: "locale_rels_recipes_fk"
    }).onDelete("cascade"),
    localeRelsFeaturesFk: foreignKey({
      columns: [table.featuresId],
      foreignColumns: [features.id],
      name: "locale_rels_features_fk"
    }).onDelete("cascade"),
  }
});

export const payloadLockedDocuments = pgTable("payload_locked_documents", {
  id: serial().primaryKey().notNull(),
  globalSlug: varchar("global_slug"),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("payload_locked_documents_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    globalSlug1Idx: index("payload_locked_documents_global_slug_1_idx").using("btree", table.globalSlug.asc().nullsLast().op("text_ops")),
    updatedAt1Idx: index("payload_locked_documents_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
  }
});

export const payloadLockedDocumentsRels = pgTable("payload_locked_documents_rels", {
  id: serial().primaryKey().notNull(),
  order: integer(),
  parentId: integer("parent_id").notNull(),
  path: varchar().notNull(),
  usersId: integer("users_id"),
  mediaId: integer("media_id"),
  mensaProviderId: integer("mensa_provider_id"),
  mensaId: integer("mensa_id"),
  servingTimeId: integer("serving_time_id"),
  timeSlotId: integer("time_slot_id"),
  servingsId: integer("servings_id"),
  infoId: integer("info_id"),
  nutrientsId: integer("nutrients_id"),
  nutrientUnitsId: integer("nutrient_units_id"),
  nutrientLabelsId: integer("nutrient_labels_id"),
  nutrientValuesId: integer("nutrient_values_id"),
  allergensId: integer("allergens_id"),
  additivesId: integer("additives_id"),
  recipesId: integer("recipes_id"),
  userImageUploadsId: integer("user_image_uploads_id"),
  featuresId: integer("features_id"),
  localeId: integer("locale_id"),
}, (table) => {
  return {
    additivesId1Idx: index("payload_locked_documents_rels_additives_id_1_idx").using("btree", table.additivesId.asc().nullsLast().op("int4_ops")),
    allergensId1Idx: index("payload_locked_documents_rels_allergens_id_1_idx").using("btree", table.allergensId.asc().nullsLast().op("int4_ops")),
    featuresId1Idx: index("payload_locked_documents_rels_features_id_1_idx").using("btree", table.featuresId.asc().nullsLast().op("int4_ops")),
    infoId1Idx: index("payload_locked_documents_rels_info_id_1_idx").using("btree", table.infoId.asc().nullsLast().op("int4_ops")),
    localeId1Idx: index("payload_locked_documents_rels_locale_id_1_idx").using("btree", table.localeId.asc().nullsLast().op("int4_ops")),
    mediaId1Idx: index("payload_locked_documents_rels_media_id_1_idx").using("btree", table.mediaId.asc().nullsLast().op("int4_ops")),
    mensaId1Idx: index("payload_locked_documents_rels_mensa_id_1_idx").using("btree", table.mensaId.asc().nullsLast().op("int4_ops")),
    mensaProviderId1Idx: index("payload_locked_documents_rels_mensa_provider_id_1_idx").using("btree", table.mensaProviderId.asc().nullsLast().op("int4_ops")),
    nutrientLabelsId1Idx: index("payload_locked_documents_rels_nutrient_labels_id_1_idx").using("btree", table.nutrientLabelsId.asc().nullsLast().op("int4_ops")),
    nutrientUnitsId1Idx: index("payload_locked_documents_rels_nutrient_units_id_1_idx").using("btree", table.nutrientUnitsId.asc().nullsLast().op("int4_ops")),
    nutrientValuesId1Idx: index("payload_locked_documents_rels_nutrient_values_id_1_idx").using("btree", table.nutrientValuesId.asc().nullsLast().op("int4_ops")),
    nutrientsId1Idx: index("payload_locked_documents_rels_nutrients_id_1_idx").using("btree", table.nutrientsId.asc().nullsLast().op("int4_ops")),
    orderIdx: index("payload_locked_documents_rels_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
    parentIdx: index("payload_locked_documents_rels_parent_idx").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
    pathIdx: index("payload_locked_documents_rels_path_idx").using("btree", table.path.asc().nullsLast().op("text_ops")),
    recipesId1Idx: index("payload_locked_documents_rels_recipes_id_1_idx").using("btree", table.recipesId.asc().nullsLast().op("int4_ops")),
    servingTimeId1Idx: index("payload_locked_documents_rels_serving_time_id_1_idx").using("btree", table.servingTimeId.asc().nullsLast().op("int4_ops")),
    servingsId1Idx: index("payload_locked_documents_rels_servings_id_1_idx").using("btree", table.servingsId.asc().nullsLast().op("int4_ops")),
    timeSlotId1Idx: index("payload_locked_documents_rels_time_slot_id_1_idx").using("btree", table.timeSlotId.asc().nullsLast().op("int4_ops")),
    userImageUploadsId1Idx: index("payload_locked_documents_rels_user_image_uploads_id_1_idx").using("btree", table.userImageUploadsId.asc().nullsLast().op("int4_ops")),
    usersId1Idx: index("payload_locked_documents_rels_users_id_1_idx").using("btree", table.usersId.asc().nullsLast().op("int4_ops")),
    payloadLockedDocumentsRelsParentFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [payloadLockedDocuments.id],
      name: "payload_locked_documents_rels_parent_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsUsersFk: foreignKey({
      columns: [table.usersId],
      foreignColumns: [users.id],
      name: "payload_locked_documents_rels_users_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsMediaFk: foreignKey({
      columns: [table.mediaId],
      foreignColumns: [media.id],
      name: "payload_locked_documents_rels_media_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsMensaProviderFk: foreignKey({
      columns: [table.mensaProviderId],
      foreignColumns: [mensaProvider.id],
      name: "payload_locked_documents_rels_mensa_provider_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsMensaFk: foreignKey({
      columns: [table.mensaId],
      foreignColumns: [mensa.id],
      name: "payload_locked_documents_rels_mensa_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsServingTimeFk: foreignKey({
      columns: [table.servingTimeId],
      foreignColumns: [servingTime.id],
      name: "payload_locked_documents_rels_serving_time_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsTimeSlotFk: foreignKey({
      columns: [table.timeSlotId],
      foreignColumns: [timeSlot.id],
      name: "payload_locked_documents_rels_time_slot_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsServingsFk: foreignKey({
      columns: [table.servingsId],
      foreignColumns: [servings.id],
      name: "payload_locked_documents_rels_servings_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsInfoFk: foreignKey({
      columns: [table.infoId],
      foreignColumns: [info.id],
      name: "payload_locked_documents_rels_info_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsNutrientsFk: foreignKey({
      columns: [table.nutrientsId],
      foreignColumns: [nutrients.id],
      name: "payload_locked_documents_rels_nutrients_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsNutrientUnitsFk: foreignKey({
      columns: [table.nutrientUnitsId],
      foreignColumns: [nutrientUnits.id],
      name: "payload_locked_documents_rels_nutrient_units_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsNutrientLabelsFk: foreignKey({
      columns: [table.nutrientLabelsId],
      foreignColumns: [nutrientLabels.id],
      name: "payload_locked_documents_rels_nutrient_labels_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsNutrientValuesFk: foreignKey({
      columns: [table.nutrientValuesId],
      foreignColumns: [nutrientValues.id],
      name: "payload_locked_documents_rels_nutrient_values_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsAllergensFk: foreignKey({
      columns: [table.allergensId],
      foreignColumns: [allergens.id],
      name: "payload_locked_documents_rels_allergens_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsAdditivesFk: foreignKey({
      columns: [table.additivesId],
      foreignColumns: [additives.id],
      name: "payload_locked_documents_rels_additives_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsRecipesFk: foreignKey({
      columns: [table.recipesId],
      foreignColumns: [recipes.id],
      name: "payload_locked_documents_rels_recipes_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsUserImageUploadsFk: foreignKey({
      columns: [table.userImageUploadsId],
      foreignColumns: [userImageUploads.id],
      name: "payload_locked_documents_rels_user_image_uploads_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsFeaturesFk: foreignKey({
      columns: [table.featuresId],
      foreignColumns: [features.id],
      name: "payload_locked_documents_rels_features_fk"
    }).onDelete("cascade"),
    payloadLockedDocumentsRelsLocaleFk: foreignKey({
      columns: [table.localeId],
      foreignColumns: [locale.id],
      name: "payload_locked_documents_rels_locale_fk"
    }).onDelete("cascade"),
  }
});

export const users = pgTable("users", {
  id: serial().primaryKey().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  email: varchar().notNull(),
  resetPasswordToken: varchar("reset_password_token"),
  resetPasswordExpiration: timestamp("reset_password_expiration", { precision: 3, withTimezone: true, mode: 'string' }),
  salt: varchar(),
  hash: varchar(),
  loginAttempts: numeric("login_attempts").default('0'),
  lockUntil: timestamp("lock_until", { precision: 3, withTimezone: true, mode: 'string' }),
}, (table) => {
  return {
    createdAt1Idx: index("users_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    email1Idx: uniqueIndex("users_email_1_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
    updatedAt1Idx: index("users_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
  }
});

export const info = pgTable("info", {
  id: serial().primaryKey().notNull(),
  title: varchar(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("info_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    updatedAt1Idx: index("info_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
  }
});

export const payloadPreferences = pgTable("payload_preferences", {
  id: serial().primaryKey().notNull(),
  key: varchar(),
  value: jsonb(),
  updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return {
    createdAt1Idx: index("payload_preferences_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
    key1Idx: index("payload_preferences_key_1_idx").using("btree", table.key.asc().nullsLast().op("text_ops")),
    updatedAt1Idx: index("payload_preferences_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
  }
});

export const payloadPreferencesRels = pgTable("payload_preferences_rels", {
  id: serial().primaryKey().notNull(),
  order: integer(),
  parentId: integer("parent_id").notNull(),
  path: varchar().notNull(),
  usersId: integer("users_id"),
}, (table) => {
  return {
    orderIdx: index("payload_preferences_rels_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
    parentIdx: index("payload_preferences_rels_parent_idx").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
    pathIdx: index("payload_preferences_rels_path_idx").using("btree", table.path.asc().nullsLast().op("text_ops")),
    usersId1Idx: index("payload_preferences_rels_users_id_1_idx").using("btree", table.usersId.asc().nullsLast().op("int4_ops")),
    payloadPreferencesRelsParentFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [payloadPreferences.id],
      name: "payload_preferences_rels_parent_fk"
    }).onDelete("cascade"),
    payloadPreferencesRelsUsersFk: foreignKey({
      columns: [table.usersId],
      foreignColumns: [users.id],
      name: "payload_preferences_rels_users_fk"
    }).onDelete("cascade"),
  }
});
