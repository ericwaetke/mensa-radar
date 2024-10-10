import { pgTable, index, pgEnum, serial, varchar, numeric, timestamp, jsonb, foreignKey, integer, uniqueIndex, unique } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const _locales = pgEnum("_locales", ['de', 'en'])
export const enum_recipe_diet = pgEnum("enum_recipe_diet", ['vegan', 'vegetarian', 'meat'])
export const enum_recipes_diet = pgEnum("enum_recipes_diet", ['vegan', 'vegetarian', 'meat'])
export const enum_serving_time_day = pgEnum("enum_serving_time_day", ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])


export const payload_migrations = pgTable("payload_migrations", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name"),
	batch: numeric("batch"),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		created_at_idx: index("payload_migrations_created_at_idx").using("btree", table.created_at),
	}
});

export const payload_preferences = pgTable("payload_preferences", {
	id: serial("id").primaryKey().notNull(),
	key: varchar("key"),
	value: jsonb("value"),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		created_at_idx: index("payload_preferences_created_at_idx").using("btree", table.created_at),
		key_idx: index("payload_preferences_key_idx").using("btree", table.key),
	}
});

export const payload_preferences_rels = pgTable("payload_preferences_rels", {
	id: serial("id").primaryKey().notNull(),
	order: integer("order"),
	parent_id: integer("parent_id").notNull().references(() => payload_preferences.id, { onDelete: "cascade" } ),
	path: varchar("path").notNull(),
	users_id: integer("users_id").references(() => users.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		order_idx: index("payload_preferences_rels_order_idx").using("btree", table.order),
		parent_idx: index("payload_preferences_rels_parent_idx").using("btree", table.parent_id),
		path_idx: index("payload_preferences_rels_path_idx").using("btree", table.path),
	}
});

export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	email: varchar("email").notNull(),
	reset_password_token: varchar("reset_password_token"),
	reset_password_expiration: timestamp("reset_password_expiration", { precision: 3, withTimezone: true, mode: 'string' }),
	salt: varchar("salt"),
	hash: varchar("hash"),
	login_attempts: numeric("login_attempts").default('0'),
	lock_until: timestamp("lock_until", { precision: 3, withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		created_at_idx: index("users_created_at_idx").using("btree", table.created_at),
		email_idx: uniqueIndex("users_email_idx").using("btree", table.email),
	}
});

export const media = pgTable("media", {
	id: serial("id").primaryKey().notNull(),
	alt: varchar("alt").notNull(),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	url: varchar("url"),
	thumbnail_u_r_l: varchar("thumbnail_u_r_l"),
	filename: varchar("filename"),
	mime_type: varchar("mime_type"),
	filesize: numeric("filesize"),
	width: numeric("width"),
	height: numeric("height"),
	focal_x: numeric("focal_x"),
	focal_y: numeric("focal_y"),
},
(table) => {
	return {
		created_at_idx: index("media_created_at_idx").using("btree", table.created_at),
		filename_idx: uniqueIndex("media_filename_idx").using("btree", table.filename),
	}
});

export const allergens = pgTable("allergens", {
	id: serial("id").primaryKey().notNull(),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		created_at_idx: index("allergens_created_at_idx").using("btree", table.created_at),
	}
});

export const mensa = pgTable("mensa", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name").notNull(),
	slug: varchar("slug"),
	address_latitude: numeric("address_latitude").notNull(),
	address_longitude: numeric("address_longitude").notNull(),
	address_street: varchar("address_street"),
	address_house_number: varchar("address_house_number"),
	address_zip_code: varchar("address_zip_code"),
	address_city: varchar("address_city"),
	description: jsonb("description").notNull(),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	provider_id: integer("provider_id").references(() => mensa_provider.id, { onDelete: "set null" } ),
},
(table) => {
	return {
		created_at_idx: index("mensa_created_at_idx").using("btree", table.created_at),
		slug_idx: index("mensa_slug_idx").using("btree", table.slug),
	}
});

export const additives = pgTable("additives", {
	id: serial("id").primaryKey().notNull(),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		created_at_idx: index("additives_created_at_idx").using("btree", table.created_at),
	}
});

export const serving_time = pgTable("serving_time", {
	id: serial("id").primaryKey().notNull(),
	mensa_info_id: integer("mensa_info_id").references(() => mensa.id, { onDelete: "set null" } ),
	day: enum_serving_time_day("day"),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		created_at_idx: index("serving_time_created_at_idx").using("btree", table.created_at),
	}
});

export const time_slot = pgTable("time_slot", {
	id: serial("id").primaryKey().notNull(),
	serving_time_id: integer("serving_time_id").references(() => serving_time.id, { onDelete: "set null" } ),
	from: timestamp("from", { precision: 3, withTimezone: true, mode: 'string' }).notNull(),
	to: timestamp("to", { precision: 3, withTimezone: true, mode: 'string' }).notNull(),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		created_at_idx: index("time_slot_created_at_idx").using("btree", table.created_at),
	}
});

export const info = pgTable("info", {
	id: serial("id").primaryKey().notNull(),
	title: varchar("title"),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		created_at_idx: index("info_created_at_idx").using("btree", table.created_at),
	}
});

export const payload_locked_documents = pgTable("payload_locked_documents", {
	id: serial("id").primaryKey().notNull(),
	global_slug: varchar("global_slug"),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		created_at_idx: index("payload_locked_documents_created_at_idx").using("btree", table.created_at),
		global_slug_idx: index("payload_locked_documents_global_slug_idx").using("btree", table.global_slug),
	}
});

export const servings = pgTable("servings", {
	id: serial("id").primaryKey().notNull(),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	recipe_id: integer("recipe_id").notNull().references(() => recipes.id, { onDelete: "set null" } ),
	date: timestamp("date", { precision: 3, withTimezone: true, mode: 'string' }).notNull(),
	mensa_id: integer("mensa_id").references(() => mensa.id, { onDelete: "set null" } ),
},
(table) => {
	return {
		created_at_idx: index("servings_created_at_idx").using("btree", table.created_at),
	}
});

export const recipes = pgTable("recipes", {
	id: serial("id").primaryKey().notNull(),
	price_students: numeric("price_students"),
	price_employees: numeric("price_employees"),
	price_guests: numeric("price_guests"),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	mensa_provider_id: integer("mensa_provider_id").references(() => mensa_provider.id, { onDelete: "set null" } ),
},
(table) => {
	return {
		created_at_idx: index("recipes_created_at_idx").using("btree", table.created_at),
	}
});

export const nutrient_labels = pgTable("nutrient_labels", {
	id: serial("id").primaryKey().notNull(),
	unit_id: integer("unit_id").notNull().references(() => nutrient_units.id, { onDelete: "set null" } ),
	recommendation: varchar("recommendation"),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		created_at_idx: index("nutrient_labels_created_at_idx").using("btree", table.created_at),
	}
});

export const nutrient_values = pgTable("nutrient_values", {
	id: serial("id").primaryKey().notNull(),
	value: numeric("value"),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		created_at_idx: index("nutrient_values_created_at_idx").using("btree", table.created_at),
		value_idx: uniqueIndex("nutrient_values_value_idx").using("btree", table.value),
	}
});

export const nutrient_units = pgTable("nutrient_units", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name").notNull(),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		created_at_idx: index("nutrient_units_created_at_idx").using("btree", table.created_at),
		name_idx: uniqueIndex("nutrient_units_name_idx").using("btree", table.name),
	}
});

export const mensa_provider = pgTable("mensa_provider", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name").notNull(),
	slug: varchar("slug"),
	description: jsonb("description").notNull(),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		created_at_idx: index("mensa_provider_created_at_idx").using("btree", table.created_at),
		slug_idx: index("mensa_provider_slug_idx").using("btree", table.slug),
	}
});

export const payload_locked_documents_rels = pgTable("payload_locked_documents_rels", {
	id: serial("id").primaryKey().notNull(),
	order: integer("order"),
	parent_id: integer("parent_id").notNull().references(() => payload_locked_documents.id, { onDelete: "cascade" } ),
	path: varchar("path").notNull(),
	users_id: integer("users_id").references(() => users.id, { onDelete: "cascade" } ),
	media_id: integer("media_id").references(() => media.id, { onDelete: "cascade" } ),
	mensa_id: integer("mensa_id").references(() => mensa.id, { onDelete: "cascade" } ),
	serving_time_id: integer("serving_time_id").references(() => serving_time.id, { onDelete: "cascade" } ),
	time_slot_id: integer("time_slot_id").references(() => time_slot.id, { onDelete: "cascade" } ),
	servings_id: integer("servings_id").references(() => servings.id, { onDelete: "cascade" } ),
	info_id: integer("info_id").references(() => info.id, { onDelete: "cascade" } ),
	nutrients_id: integer("nutrients_id").references(() => nutrients.id, { onDelete: "cascade" } ),
	nutrient_units_id: integer("nutrient_units_id").references(() => nutrient_units.id, { onDelete: "cascade" } ),
	nutrient_labels_id: integer("nutrient_labels_id").references(() => nutrient_labels.id, { onDelete: "cascade" } ),
	nutrient_values_id: integer("nutrient_values_id").references(() => nutrient_values.id, { onDelete: "cascade" } ),
	allergens_id: integer("allergens_id").references(() => allergens.id, { onDelete: "cascade" } ),
	additives_id: integer("additives_id").references(() => additives.id, { onDelete: "cascade" } ),
	recipes_id: integer("recipes_id").references(() => recipes.id, { onDelete: "cascade" } ),
	mensa_provider_id: integer("mensa_provider_id").references(() => mensa_provider.id, { onDelete: "cascade" } ),
	user_image_uploads_id: integer("user_image_uploads_id").references(() => user_image_uploads.id, { onDelete: "cascade" } ),
	features_id: integer("features_id").references(() => features.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		order_idx: index("payload_locked_documents_rels_order_idx").using("btree", table.order),
		parent_idx: index("payload_locked_documents_rels_parent_idx").using("btree", table.parent_id),
		path_idx: index("payload_locked_documents_rels_path_idx").using("btree", table.path),
	}
});

export const nutrients = pgTable("nutrients", {
	id: serial("id").primaryKey().notNull(),
	nutrient_value_id: integer("nutrient_value_id").references(() => nutrient_values.id, { onDelete: "set null" } ),
	nutrient_label_id: integer("nutrient_label_id").references(() => nutrient_labels.id, { onDelete: "set null" } ),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	recipe_id: integer("recipe_id").references(() => recipes.id, { onDelete: "set null" } ),
},
(table) => {
	return {
		created_at_idx: index("nutrients_created_at_idx").using("btree", table.created_at),
	}
});

export const user_image_uploads = pgTable("user_image_uploads", {
	id: serial("id").primaryKey().notNull(),
	image_id: integer("image_id").notNull().references(() => media.id, { onDelete: "set null" } ),
	unique_user_id: varchar("unique_user_id").notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	recipe_id: integer("recipe_id").notNull().references(() => recipes.id, { onDelete: "set null" } ),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const recipes_rels = pgTable("recipes_rels", {
	id: serial("id").primaryKey().notNull(),
	order: integer("order"),
	parent_id: integer("parent_id").notNull().references(() => recipes.id, { onDelete: "cascade" } ),
	path: varchar("path").notNull(),
	additives_id: integer("additives_id").references(() => additives.id, { onDelete: "cascade" } ),
	allergens_id: integer("allergens_id").references(() => allergens.id, { onDelete: "cascade" } ),
	features_id: integer("features_id").references(() => features.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		order_idx: index("recipes_rels_order_idx").using("btree", table.order),
		parent_idx: index("recipes_rels_parent_idx").using("btree", table.parent_id),
		path_idx: index("recipes_rels_path_idx").using("btree", table.path),
	}
});

export const features_locales = pgTable("features_locales", {
	name: varchar("name"),
	id: serial("id").primaryKey().notNull(),
	_locale: _locales("_locale").notNull(),
	_parent_id: integer("_parent_id").notNull().references(() => features.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		features_locales_locale_parent_id_unique: unique("features_locales_locale_parent_id_unique").on(table._locale, table._parent_id),
	}
});

export const nutrient_labels_locales = pgTable("nutrient_labels_locales", {
	name: varchar("name").notNull(),
	id: serial("id").primaryKey().notNull(),
	_locale: _locales("_locale").notNull(),
	_parent_id: integer("_parent_id").notNull().references(() => nutrient_labels.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		nutrient_labels_name_idx: uniqueIndex("nutrient_labels_name_idx").using("btree", table.name, table._locale),
		nutrient_labels_locales_locale_parent_id_unique: unique("nutrient_labels_locales_locale_parent_id_unique").on(table._locale, table._parent_id),
	}
});

export const allergens_locales = pgTable("allergens_locales", {
	name: varchar("name"),
	id: serial("id").primaryKey().notNull(),
	_locale: _locales("_locale").notNull(),
	_parent_id: integer("_parent_id").notNull().references(() => allergens.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		allergens_locales_locale_parent_id_unique: unique("allergens_locales_locale_parent_id_unique").on(table._locale, table._parent_id),
	}
});

export const additives_locales = pgTable("additives_locales", {
	name: varchar("name"),
	id: serial("id").primaryKey().notNull(),
	_locale: _locales("_locale").notNull(),
	_parent_id: integer("_parent_id").notNull().references(() => additives.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		additives_locales_locale_parent_id_unique: unique("additives_locales_locale_parent_id_unique").on(table._locale, table._parent_id),
	}
});

export const features = pgTable("features", {
	id: serial("id").primaryKey().notNull(),
	mensa_provider_id: integer("mensa_provider_id").references(() => mensa_provider.id, { onDelete: "set null" } ),
	updated_at: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	created_at: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		created_at_idx: index("features_created_at_idx").using("btree", table.created_at),
	}
});

export const recipes_locales = pgTable("recipes_locales", {
	name: varchar("name").notNull(),
	id: serial("id").primaryKey().notNull(),
	_locale: _locales("_locale").notNull(),
	_parent_id: integer("_parent_id").notNull().references(() => recipes.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		recipes_locales_locale_parent_id_unique: unique("recipes_locales_locale_parent_id_unique").on(table._locale, table._parent_id),
	}
});
