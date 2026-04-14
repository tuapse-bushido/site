# ---------- Stage 1: builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Отключаем Husky и другие скрипты, чтобы билд не падал без .git
ENV HUSKY=0

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Вызываем напрямую, чтобы обойти проверку workspaces в pnpm v10
RUN ./node_modules/.bin/next build --webpack

# ---------- Stage 2: production ----------
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN corepack enable

RUN echo "ignore-scripts=true" > .npmrc

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Копируем результаты компиляции
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# Если тебе НУЖЕН generate при старте контейнера:
# CMD ["sh", "-c", "./node_modules/.bin/next build --experimental-build-mode=generate && node server.js"]

# Если generate не обязателен (обычный запуск):
CMD ["node", "server.js"]