# Mirrors the mensa-hub Dockerfile: multi-stage, corepack pnpm, build inside
# the image, then a slim runtime image containing only the Nitro output.

FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS base-deps
# libc6-compat is needed by some deps on musl (alpine)
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=base-deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm run build

# Production image, copy only the Nitro output and run it
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# .output contains the built server, its bundled node_modules and the public assets
COPY --from=builder /app/.output ./.output

EXPOSE 4321

ENV PORT=4321

# Nitro's node-server preset entry point (see `pnpm run build`)
CMD ["node", ".output/server/index.mjs"]
