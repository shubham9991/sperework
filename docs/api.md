# API & Endpoints Overview (v1)

Base URL
- SaaS: https://api.worksphere.io/api/v1
- On‑prem: https://<your-domain>/api/v1

Auth
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /auth/me

Organizations & Users
- POST /orgs
- GET /orgs/{orgId}
- PATCH /orgs/{orgId}
- GET /orgs/{orgId}/users
- POST /orgs/{orgId}/users/invite
- POST /orgs/{orgId}/users/invite/bulk

Projects & Issues
- GET /orgs/{orgId}/projects
- POST /orgs/{orgId}/projects
- GET /projects/{projectId}
- GET /projects/{projectId}/issues
- POST /projects/{projectId}/issues
- PATCH /issues/{issueId}
- POST /issues/{issueId}/comments
- POST /issues/{issueId}/attachments

Boards, Backlog, Sprints
- GET /projects/{projectId}/board
- POST /projects/{projectId}/sprints
- PATCH /sprints/{sprintId}

Wiki Pages
- GET /pages/{pageId}
- POST /pages
- PATCH /pages/{pageId}
- POST /pages/{pageId}/export

Integrations & Webhooks
- POST /integrations/{integrationId}/install
- DELETE /integrations/{integrationId}/uninstall
- POST /integrations/{integrationId}/webhook
- GET /webhooks
- POST /webhooks

Admin & Audit
- GET /admin/audit-logs
- GET /admin/health

Billing
- GET /billing/invoices
- POST /billing/checkout

Developer
- GET /dev/apps
- POST /dev/apps
- POST /dev/apps/{appId}/keys

Events (sample)
- issue.created | issue.updated | issue.transitioned
- page.created | page.updated
- test-run.completed
- build.completed | deployment.completed
- user.invited | user.provisioned
- billing.invoice.created | payment.succeeded

