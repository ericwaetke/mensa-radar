/// <reference types="vinxi/types/client" />

interface ImportMetaEnv {
	DB_URL: string
	DB_MIGRATIONS_URL: string
	SITE_NAME: string
	SESSION_SECRET: string
	POSTGRES_USER: string
	POSTGRES_PASSWORD: string
	POSTGRES_PASSWORD_FILE: string
	POSTGRES_HOST: string
	POSTGRES_DB: string
	POSTGRES_PORT: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
