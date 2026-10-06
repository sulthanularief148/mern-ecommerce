# ---- deps: install once, reused by both dev and prod stages ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci && npx prisma generate

# ---- production runtime ----
FROM node:20-alpine AS production
RUN apk add --no-cache dumb-init
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S ecofashion -G nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

RUN chmod +x docker-entrypoint.sh && chown -R ecofashion:nodejs /app

USER ecofashion
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# dumb-init forwards SIGTERM correctly so Prisma/Redis connections close
# cleanly on container stop instead of being killed mid-request.
ENTRYPOINT ["dumb-init", "--", "./docker-entrypoint.sh"]
