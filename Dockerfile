FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Устанавливаем pnpm напрямую через npm
RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml* ./
RUN pnpm i

FROM base AS builder
WORKDIR /app
RUN npm install -g pnpm@latest

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- Принимаем build-аргументы из GitHub Actions ---
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_DADATA_API_KEY

# --- Пробрасываем их в ENV, чтобы Next.js увидел их при сборке ---
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_DADATA_API_KEY=$NEXT_PUBLIC_DADATA_API_KEY

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]