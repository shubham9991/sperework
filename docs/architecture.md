# Architecture & Deployment

## Tech Stack
- Frontend: React + Vite, Ant Design + Material UI (module-dependent), React Query, Zustand/Redux Toolkit, i18n, ECharts.
- Backend: Node.js (TypeScript), Fastify/Express, Postgres (Prisma/Knex), Redis, OpenSearch, BullMQ for jobs, OpenAPI, GraphQL (phase 2+), WebSocket/SSE.
- Infra: Docker, Kubernetes (EKS/AKS/GKE or on‑prem K8s), S3-compatible object storage, CDN, Vault for secrets, OTel for tracing, Prometheus/Grafana, Loki/ELK.

## High-level Architecture
- SPA + BFF/REST APIs; multi-tenant aware services; modular domain services (Auth, Org, Project/Issue, Docs, Automation, Integrations, Billing, Admin, Search).
- Event bus (Kafka/NATS) for async events and webhooks.
- Caching with Redis; background workers with BullMQ.

## Deployment Models
1) SaaS Multi-tenant: shared app tier + shared DB (schema per tenant or row-level tenant_id) + shared object storage; per-tenant rate limits; per-region clusters.
2) Single-tenant SaaS: isolated DB + namespace; optional dedicated VPC.
3) Self-host / On-prem: Helm charts + installer; external Postgres/Redis/MinIO; license key validation; optional CMK integration.
4) Hybrid: data-in-country (regional DB/storage) with cloud integrations.

## Tenancy Strategy
- MVP: single database with tenant_id scoping + RLS policies; separate schema for high-volume tenants (phase 2).

## Security & Compliance
- TLS everywhere; AES-256 at rest; CMK via AWS KMS/Azure KeyVault; RBAC with policy engine; audit logs; secrets in Vault; Snyk/Dependabot.

## Data Model (high-level)
- Core entities: Organization, User, Team, Project, Issue, Sprint, Epic, Page, Attachment, TestCase/Run, Integration/App/Webhook, AuditLog, BillingAccount/Invoice/Payment, Asset, Contract, AutomationRule, Notification.

## CI/CD
- GitHub Actions with reusable workflows; unit/integration/e2e; canary + progressive delivery; DB migrations; artifact versioning; SBOM.

## Observability
- OpenTelemetry instrumentation; metrics and logs shipping; alerting integrations; synthetic monitoring.

## Performance Targets
- API p95 < 200ms; search < 1s; initial shell < 1.5s.

