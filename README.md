# Webfarm's Wear — Ecommerce Platform

A full-stack ecommerce platform: React/Vite storefront, React/Vite admin panel, and a layered Node/Express API backed by MySQL (via Prisma) and Redis.

## Architecture

```
                    ┌────────────┐
   browser ───────► │  gateway   │  nginx reverse proxy — single public origin
                    └─────┬──────┘
                 ┌────────┴────────┐
                 │                 │
          ┌──────▼─────┐    ┌──────▼──────┐
          │   client   │    │   server    │──────┐
          │ (storefront│    │  (Express   │      │
          │  static,   │    │  REST API)  │      │
          │  nginx)    │    └──────┬──────┘      │
          └────────────┘           │             │
                             ┌─────▼─────┐  ┌─────▼─────┐
   admin (own port) ───────► │   MySQL   │  │   Redis   │
   talks to server directly  │ (Prisma)  │  │ (sessions,│
                              └───────────┘  │  cache,   │
                                              │ rate-limit)│
                                              └───────────┘
```

- **`server/`** — layered backend: `routes → controllers → services → repositories`, one folder per domain module (`auth`, `product`, `cart`, `order`) under `src/modules/`. See `server/prisma/schema.prisma` for the data model.
- **`client/`** — customer-facing storefront. Reachable only through the `gateway` in Docker (same-origin API calls, no CORS needed).
- **`admin/`** — admin panel. Runs standalone on its own port and talks to `server` directly (cross-origin, allowed via `ALLOWED_ORIGINS`).
- **`gateway/`** — nginx reverse proxy: `/api/*` → `server`, everything else → `client`. The single public entry point in a Docker deployment.

## Auth model

Short-lived JWT **access tokens** (kept in memory in the frontend, never persisted to storage) plus long-lived, rotating **refresh tokens** stored server-side in Redis and delivered as an httpOnly cookie. A refresh token is single-use — every `/api/auth/refresh` call issues a new one and invalidates the old, so a leaked-but-unused token can be replayed at most once. Logging out, or an admin action, can revoke all of a user's sessions instantly by dropping their Redis keys — no waiting for a JWT to expire.

## Running with Docker (recommended)

Requires Docker + Docker Compose.

```bash
cp server/.env.example server/.env   # fill in real secrets (Cloudinary, Stripe, Razorpay, JWT secrets, admin credentials)
docker compose up -d --build
```

This starts MySQL, Redis, the API, both frontends, and the gateway. On first boot the `server` container automatically waits for MySQL, runs `prisma migrate deploy`, and seeds the admin user from `ADMIN_EMAIL`/`ADMIN_PASSWORD`.

| Service  | URL                       |
|----------|---------------------------|
| Storefront + API (via gateway) | http://localhost:8090 |
| Admin panel | http://localhost:5174 |
| API directly | http://localhost:4000 |
| MySQL | localhost:3306 |
| Redis | localhost:6379 |

Building all four application images concurrently is memory-hungry; on a constrained machine build them one at a time instead:

```bash
docker compose build server && docker compose build client && docker compose build admin && docker compose build gateway
docker compose up -d
```

## Demo data

`npm run seed:demo-products` (from `server/`, with the API reachable at `API_URL`, default `http://localhost:4000`) logs in as the seeded admin and creates ~12 demo products via the real `/api/products/add` endpoint, uploading images straight from `client/src/assets/p_img*.png` to Cloudinary — the same path a real admin submission takes. Safe to re-run; it only ever adds products, never deletes.

## Running locally without Docker

Each app has its own `.env` (see `server/.env.example`). You still need MySQL and Redis reachable — the easiest way is `docker compose up -d mysql redis` and pointing `DATABASE_URL`/`REDIS_URL` in `server/.env` at `localhost`.

```bash
# server
cd server && npm install && npx prisma migrate deploy && node prisma/seed.js && npm run dev

# client (in a separate terminal)
cd client && npm install && npm run start

# admin (in a separate terminal)
cd admin && npm install && npm run start
```

## Deploying to Vercel

`server/vercel.json`, `client/vercel.json` and `admin/vercel.json` are still present for serverless deployment. The server's `postinstall` script runs `prisma generate` automatically. You'll need a managed MySQL instance (PlanetScale, RDS, etc.) and a managed Redis instance (Upstash, etc.) reachable from Vercel's network — point `DATABASE_URL` / `REDIS_URL` at those in the Vercel project's environment variables.
