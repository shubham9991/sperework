# Backend

Stack
- Node.js (TypeScript)
- Framework: Fastify or Express
- Database: Postgres
- Queue: BullMQ + Redis (later)

Dev
- Env: `.env` with DB connection
- Migrations: to be added (Prisma/Knex)
- Run: `npm run dev`

Notes
- Multi-tenant via `tenant_id` scoping.
- License key validation for on‑prem.
