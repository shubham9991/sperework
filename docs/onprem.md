# On‑prem Installer & License Flow

## Goals
- Easy customer-managed installation on VPS/AWS/Azure/GCP or on‑prem servers.
- Secure access delegation: customer can grant temporary access by sharing a time-bound support token without exposing root credentials.
- White-label: upload logo/colors and apply across UI.

## Installation Options
1) Docker Compose (single-node) — MVP
2) Kubernetes Helm chart (HA) — Phase 2

## Prerequisites
- Postgres (v15+)
- Redis (v7+)
- Object storage (S3/MinIO)
- Optional: OpenSearch, SMTP, SSO IdP

## Steps (Compose)
1. Download installer package and `.env` template
2. Run `setup` script to generate secrets and pull images
3. Provide license key when prompted (or set LICENSE_KEY env)
4. Run `docker compose up -d`
5. Access Admin Setup Wizard at `/admin/setup`

## Admin Setup Wizard
- Enter organization name, region, branding (logo/colors)
- Configure SSO (optional)
- Create initial admin user
- Validate license (online or offline activation via signed file)

## License Management
- License key format: signed JWT with claims: plan, seats, expiry, features
- Online check: call licensing API; cache result; grace period for outages
- Offline: upload signed license file; periodic renewal reminders

## Access Delegation for Vendor Support
- Admin can generate a time-bound support token (e.g., 24–72h) with limited scopes
- Vendor uses token to access a support console; all actions audited

## White‑labeling
- Upload assets at `/admin/branding` (logo, favicon, primary/secondary colors)
- Stored in object storage; served via CDN; applied via theme config

## Upgrades
- In-app notification of new versions
- One-click backup + upgrade (Compose) or Helm chart upgrade (K8s)
- Rollback if health checks fail

