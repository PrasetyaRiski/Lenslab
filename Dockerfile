# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lenslab?schema=public"

COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma/

# Prisma 5 reads DATABASE_URL from schema.prisma and does not need prisma.config.ts.
# `prisma generate` does not connect to the database, so a build-time dummy URL is enough.
RUN npx prisma generate

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN NODE_OPTIONS="--max_old_space_size=1536" npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
RUN chmod +x /app/docker-entrypoint.sh && \
    chown -R nextjs:nodejs /app/node_modules /app/scripts /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
