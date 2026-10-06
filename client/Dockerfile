# ---- build ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Vite inlines import.meta.env.VITE_* at BUILD time, so the backend URL has
# to be a build arg, not a runtime env var — a plain `environment:` entry in
# docker-compose would have no effect on the already-built static bundle.
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Optional — leave unset to keep analytics fully inert (see src/lib/analytics.js).
ARG VITE_GA4_ID
ENV VITE_GA4_ID=${VITE_GA4_ID}
ARG VITE_META_PIXEL_ID
ENV VITE_META_PIXEL_ID=${VITE_META_PIXEL_ID}

COPY . .
RUN npm run build

# ---- serve ----
FROM nginx:1.27-alpine AS production
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
