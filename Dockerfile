# ---------- Stage 1: builder ----------
FROM node:24.11-alpine AS builder
WORKDIR /app

ENV HUSKY=0
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@10.33 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# NEXT_PUBLIC_* values are embedded in browser bundles during compilation.
ARG NEXT_PUBLIC_IMAGES_DOMAIN=https://s3.regru.cloud/bushido/
ARG NEXT_PUBLIC_IMAGES_PRODUCTS=https://s3.regru.cloud/bushido/
ARG NEXT_PUBLIC_IMAGES_CATEGORIES=https://s3.regru.cloud/bushido/
ARG NEXT_PUBLIC_SOCKET_URL
ARG NEXT_PUBLIC_SOCKET_PORT

RUN pnpm compile

# ---------- Stage 2: production ----------
FROM node:24.11-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN corepack enable && corepack prepare pnpm@10.33 --activate

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["sh", "-c", "pnpm generate && node server.js"]
