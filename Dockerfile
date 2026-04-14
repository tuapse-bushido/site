# ---------- Stage 1: builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Объявляем, что Docker ожидает эти данные при сборке
ARG JWT_SECRET
ARG DATABASE_URL

# Прокидываем их в систему, чтобы Next.js их увидел
ENV JWT_SECRET=$JWT_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV HUSKY=0
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Теперь обычный билд создаст папку standalone и не упадет
RUN ./node_modules/.bin/next build --webpack