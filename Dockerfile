FROM base AS builder
WORKDIR /app
RUN npm install -g pnpm@latest

# 1. Принимаем аргументы из deploy.yml
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_DADATA_API_KEY

# 2. Делаем их доступными для Next.js при сборке
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_DADATA_API_KEY=$NEXT_PUBLIC_DADATA_API_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build