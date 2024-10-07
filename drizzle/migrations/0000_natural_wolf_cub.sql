-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "public"."_locales" AS ENUM('de', 'en');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."enum_recipe_diet" AS ENUM('vegan', 'vegetarian', 'meat');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."enum_recipes_diet" AS ENUM('vegan', 'vegetarian', 'meat');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."enum_serving_time_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payload_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payload_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"salt" varchar,
	"hash" varchar,
	"login_attempts" numeric DEFAULT 0,
	"lock_until" timestamp(3) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"thumbnail_u_r_l" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "allergens" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mensa" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar,
	"address_latitude" numeric NOT NULL,
	"address_longitude" numeric NOT NULL,
	"address_street" varchar,
	"address_house_number" varchar,
	"address_zip_code" varchar,
	"address_city" varchar,
	"description" jsonb NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"provider_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "additives" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serving_time" (
	"id" serial PRIMARY KEY NOT NULL,
	"mensa_info_id" integer,
	"day" "enum_serving_time_day",
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "time_slot" (
	"id" serial PRIMARY KEY NOT NULL,
	"serving_time_id" integer,
	"from" timestamp(3) with time zone NOT NULL,
	"to" timestamp(3) with time zone NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "info" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"global_slug" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "servings" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"recipe_id" integer NOT NULL,
	"date" timestamp(3) with time zone NOT NULL,
	"mensa_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"price_students" numeric,
	"price_employees" numeric,
	"price_guests" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"mensa_provider_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nutrient_labels" (
	"id" serial PRIMARY KEY NOT NULL,
	"unit_id" integer NOT NULL,
	"recommendation" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nutrient_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nutrient_units" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mensa_provider" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar,
	"description" jsonb NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer,
	"media_id" integer,
	"mensa_id" integer,
	"serving_time_id" integer,
	"time_slot_id" integer,
	"servings_id" integer,
	"info_id" integer,
	"nutrients_id" integer,
	"nutrient_units_id" integer,
	"nutrient_labels_id" integer,
	"nutrient_values_id" integer,
	"allergens_id" integer,
	"additives_id" integer,
	"recipes_id" integer,
	"mensa_provider_id" integer,
	"user_image_uploads_id" integer,
	"features_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nutrients" (
	"id" serial PRIMARY KEY NOT NULL,
	"nutrient_value_id" integer,
	"nutrient_label_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"recipe_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_image_uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_id" integer NOT NULL,
	"unique_user_id" varchar NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"recipe_id" integer NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipes_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"additives_id" integer,
	"allergens_id" integer,
	"features_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "features_locales" (
	"name" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL,
	CONSTRAINT "features_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nutrient_labels_locales" (
	"name" varchar NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL,
	CONSTRAINT "nutrient_labels_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "allergens_locales" (
	"name" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL,
	CONSTRAINT "allergens_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "additives_locales" (
	"name" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL,
	CONSTRAINT "additives_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "features" (
	"id" serial PRIMARY KEY NOT NULL,
	"mensa_provider_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipes_locales" (
	"name" varchar NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL,
	CONSTRAINT "recipes_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mensa" ADD CONSTRAINT "mensa_provider_id_mensa_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."mensa_provider"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serving_time" ADD CONSTRAINT "serving_time_mensa_info_id_mensa_id_fk" FOREIGN KEY ("mensa_info_id") REFERENCES "public"."mensa"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "time_slot" ADD CONSTRAINT "time_slot_serving_time_id_serving_time_id_fk" FOREIGN KEY ("serving_time_id") REFERENCES "public"."serving_time"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "servings" ADD CONSTRAINT "servings_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "servings" ADD CONSTRAINT "servings_mensa_id_mensa_id_fk" FOREIGN KEY ("mensa_id") REFERENCES "public"."mensa"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipes" ADD CONSTRAINT "recipes_mensa_provider_id_mensa_provider_id_fk" FOREIGN KEY ("mensa_provider_id") REFERENCES "public"."mensa_provider"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nutrient_labels" ADD CONSTRAINT "nutrient_labels_unit_id_nutrient_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."nutrient_units"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_serving_time_fk" FOREIGN KEY ("serving_time_id") REFERENCES "public"."serving_time"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_time_slot_fk" FOREIGN KEY ("time_slot_id") REFERENCES "public"."time_slot"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_info_fk" FOREIGN KEY ("info_id") REFERENCES "public"."info"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mensa_fk" FOREIGN KEY ("mensa_id") REFERENCES "public"."mensa"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mensa_provider_fk" FOREIGN KEY ("mensa_provider_id") REFERENCES "public"."mensa_provider"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_user_image_uploads_fk" FOREIGN KEY ("user_image_uploads_id") REFERENCES "public"."user_image_uploads"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_nutrient_units_fk" FOREIGN KEY ("nutrient_units_id") REFERENCES "public"."nutrient_units"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_nutrient_labels_fk" FOREIGN KEY ("nutrient_labels_id") REFERENCES "public"."nutrient_labels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_nutrient_values_fk" FOREIGN KEY ("nutrient_values_id") REFERENCES "public"."nutrient_values"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_nutrients_fk" FOREIGN KEY ("nutrients_id") REFERENCES "public"."nutrients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recipes_fk" FOREIGN KEY ("recipes_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_allergens_fk" FOREIGN KEY ("allergens_id") REFERENCES "public"."allergens"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_additives_fk" FOREIGN KEY ("additives_id") REFERENCES "public"."additives"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_servings_fk" FOREIGN KEY ("servings_id") REFERENCES "public"."servings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nutrients" ADD CONSTRAINT "nutrients_nutrient_value_id_nutrient_values_id_fk" FOREIGN KEY ("nutrient_value_id") REFERENCES "public"."nutrient_values"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nutrients" ADD CONSTRAINT "nutrients_nutrient_label_id_nutrient_labels_id_fk" FOREIGN KEY ("nutrient_label_id") REFERENCES "public"."nutrient_labels"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nutrients" ADD CONSTRAINT "nutrients_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_image_uploads" ADD CONSTRAINT "user_image_uploads_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_image_uploads" ADD CONSTRAINT "user_image_uploads_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipes_rels" ADD CONSTRAINT "recipes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipes_rels" ADD CONSTRAINT "recipes_rels_additives_fk" FOREIGN KEY ("additives_id") REFERENCES "public"."additives"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipes_rels" ADD CONSTRAINT "recipes_rels_allergens_fk" FOREIGN KEY ("allergens_id") REFERENCES "public"."allergens"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipes_rels" ADD CONSTRAINT "recipes_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "features_locales" ADD CONSTRAINT "features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nutrient_labels_locales" ADD CONSTRAINT "nutrient_labels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nutrient_labels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "allergens_locales" ADD CONSTRAINT "allergens_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."allergens"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "additives_locales" ADD CONSTRAINT "additives_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."additives"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "features" ADD CONSTRAINT "features_mensa_provider_id_mensa_provider_id_fk" FOREIGN KEY ("mensa_provider_id") REFERENCES "public"."mensa_provider"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipes_locales" ADD CONSTRAINT "recipes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "allergens_created_at_idx" ON "allergens" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mensa_created_at_idx" ON "mensa" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mensa_slug_idx" ON "mensa" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "additives_created_at_idx" ON "additives" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "serving_time_created_at_idx" ON "serving_time" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "time_slot_created_at_idx" ON "time_slot" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "info_created_at_idx" ON "info" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "servings_created_at_idx" ON "servings" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipes_created_at_idx" ON "recipes" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nutrient_labels_created_at_idx" ON "nutrient_labels" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nutrient_values_created_at_idx" ON "nutrient_values" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "nutrient_values_value_idx" ON "nutrient_values" USING btree ("value" numeric_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nutrient_units_created_at_idx" ON "nutrient_units" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "nutrient_units_name_idx" ON "nutrient_units" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mensa_provider_created_at_idx" ON "mensa_provider" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mensa_provider_slug_idx" ON "mensa_provider" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nutrients_created_at_idx" ON "nutrients" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipes_rels_order_idx" ON "recipes_rels" USING btree ("order" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipes_rels_parent_idx" ON "recipes_rels" USING btree ("parent_id" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipes_rels_path_idx" ON "recipes_rels" USING btree ("path" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "nutrient_labels_name_idx" ON "nutrient_labels_locales" USING btree ("name" text_ops,"_locale" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "features_created_at_idx" ON "features" USING btree ("created_at" timestamptz_ops);
*/