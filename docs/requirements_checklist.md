# WorkSphere Requirements Task List

Legend
- [x] Completed
- [ ] Pending

## Core Platform
- [x] Repo structure with `frontend/` and `backend/`
- [x] Backend scaffold (Fastify + TS + Prisma + Postgres)
- [x] Env config and `.env.example` guidance
- [x] Health endpoint `/health`
- [ ] Docker Compose (API + Postgres)
- [ ] CI (build/test) and linting

## Identity & Access
- [x] Register `POST /api/v1/auth/register`
- [x] Login `POST /api/v1/auth/login`
- [x] Me `GET /api/v1/auth/me` (JWT)
- [ ] Password reset (init/confirm)
- [ ] SSO (SAML/OIDC) configuration endpoints
- [ ] SCIM user provisioning endpoints
- [ ] MFA (TOTP/WebAuthn)
- [ ] Session/device management
- [ ] Guest users
- [ ] Auth audit logs

## Organizations, Workspaces & Teams
- [x] Create Org `POST /api/v1/orgs`
- [x] Get Org `GET /api/v1/orgs/{orgId}`
- [ ] List Orgs (for admin)
- [ ] Teams: CRUD
- [ ] Workspaces/Projects permissions & roles
- [ ] Org branding upload (logo/colors)
- [ ] Org policies: data retention/export rules

## Projects & Issues
- [x] List Projects `GET /api/v1/orgs/{orgId}/projects`
- [x] Create Project `POST /api/v1/orgs/{orgId}/projects`
- [x] List Issues `GET /api/v1/projects/{projectId}/issues`
- [x] Create Issue `POST /api/v1/projects/{projectId}/issues`
- [x] Update Issue `PATCH /api/v1/issues/{issueId}`
- [ ] Issue comments + mentions
- [ ] Attachments (S3/MinIO)
- [ ] Custom fields & types
- [ ] Workflows (statuses, transitions)
- [ ] Boards (swimlanes/WIP limits)
- [ ] Backlog bulk ops
- [ ] Sprints (start/end, reports)
- [ ] Roadmaps (Gantt/Timeline)
- [ ] Releases & versions
- [ ] SLA policies (ITSM)

## Views & Visualizers
- [ ] List/Board/Table/Gantt/Calendar endpoints
- [ ] Saved filters/searches

## Knowledge & Docs (Wiki)
- [x] List Pages `GET /api/v1/projects/{projectId}/pages`
- [x] Create Page `POST /api/v1/projects/{projectId}/pages`
- [x] Update Page `PATCH /api/v1/pages/{pageId}`
- [x] Export Page stub `POST /api/v1/pages/{pageId}/export`
- [ ] Versioning + compare + rollback
- [ ] Page-level permissions
- [ ] Public/Private portals

## Test & QA
- [ ] Test cases/suites/runs entities
- [ ] CI ingest for automated runs
- [ ] Coverage mapping

## CI/CD & DevOps
- [ ] Link commits/PRs by issue key
- [ ] Pipeline/build status on issues
- [ ] Deployment tracking

## Releases & Change Management
- [ ] Release planning & approvals
- [ ] Change requests (CAB)

## HR / Employee
- [ ] Employee directory, org chart
- [ ] Onboarding/offboarding workflows
- [ ] Leave & attendance

## ITSM & Service Desk
- [ ] Tickets/incidents/problems/changes
- [ ] SLAs & escalations
- [ ] Service catalog
- [ ] CMDB/assets

## CRM-lite & Sales
- [ ] Leads/Accounts/Opportunities/Deals
- [ ] Stages/forecast, activities

## Finance & Procurement
- [ ] Budgets, expenses, PR→PO→GR
- [ ] Vendor/contracts

## Reporting & Analytics
- [ ] Dashboard builder endpoints
- [ ] Prebuilt dashboards
- [ ] Scheduled reports

## Automation Engine
- [ ] Rule builder (triggers/conditions/actions)
- [ ] Schedulers/cron
- [ ] Webhooks outbound/inbound

## Notifications & Communications
- [ ] Email provider integration
- [ ] Slack/Teams notifications
- [ ] Preferences & digests

## Integrations & Marketplace
- [ ] OAuth app model + install/uninstall
- [ ] 20 core connectors (MVP)
- [ ] App scopes & billing

## Billing & Licensing
- [ ] Seat/tier billing model endpoints
- [ ] Invoices/payments/taxes
- [ ] On‑prem license validation + offline activation

## Admin & Audit
- [ ] Audit logs endpoints + export
- [ ] Data residency + export requests
- [ ] Maintenance windows

## Developer Platform & APIs
- [ ] API keys & rate limiting
- [ ] Webhooks management (retry/DLQ)
- [ ] SDKs/CLI (stubs)

## Mobile & Offline
- [ ] Push notifications API
- [ ] Offline sync hooks

## Non‑functional
- [ ] Security headers & helmet
- [ ] Input validation everywhere (zod complete)
- [ ] RBAC middleware and permission checks
- [ ] Telemetry (OpenTelemetry) + logs/metrics
- [ ] Backups and migrations automation

## Import/Export & Migration
- [ ] CSV importer (issues, projects)
- [ ] Jira importer (basic)
- [ ] Export CSV/JSON endpoints

---

Progress Summary
- Backend MVP auth/org/projects/issues/pages and health are in place.
- Swagger removed for now due to v4/v5 plugin mismatch; can re-add once compatible version is selected.
