# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb pnpm-lock.yaml* /temp/dev/
RUN cd /temp/dev && corepack enable pnpm && pnpm i --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb pnpm-lock.yaml* /temp/prod/
RUN cd /temp/prod && corepack enable pnpm && pnpm i --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
# RUN ls -alh /usr/src/app
# RUN cat /usr/src/app/tailwind.config.js
RUN corepack enable pnpm && pnpm run build

# copy production dependencies and source code into final image
FROM base AS release
# COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/.output .
# COPY --from=prerelease /usr/src/app/package.json .

# run the app
USER bun
EXPOSE 4321/tcp
ENTRYPOINT [ "pnpm", "run", "./server/index.mjs" ]
