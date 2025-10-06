# QA Testing Guide (Postman)

Prerequisites
- Install Postman
- Backend running at http://localhost:4000
- Files: import `backend/postman/WorkSphere.postman_collection.json` and `backend/postman/WorkSphere.postman_environment.json`

Environment Setup
1) Import the Postman environment and set:
   - baseUrl: http://localhost:4000
   - token: (leave blank initially)
   - orgId, projectId, issueId, pageId: (will fill later as you create data)

Auth Flow
1) Register
   - Request: Auth → Register
   - Body example:
     {
       "email": "qa1@example.com",
       "name": "QA One",
       "password": "Passw0rd!"
     }
   - Expect 201 with user id
2) Login
   - Request: Auth → Login
   - Body example:
     { "email": "qa1@example.com", "password": "Passw0rd!" }
   - Copy token from response and set it in environment variable `token`
3) Me (verify)
   - Request: Auth → Me (uses Bearer token)
   - Expect 200 with your user info

Organization & Projects
1) Create Org
   - Request: Organizations → Create Org
   - Body:
     { "name": "QA Org", "slug": "qa-org" }
   - Copy `id` to environment as `orgId`
2) Start Trial (Billing)
   - Request: Billing → Provision Default Plan (run once if not provisioned)
   - Request: Billing → Start Trial (30 days)
   - Confirm subscription with Billing → Get Subscription
3) Create Project
   - Request: Projects → Create Project
   - Body:
     { "name": "QA Project", "key": "QAP" }
   - Copy project `id` to `projectId`

Issues & Comments
1) Create Issue
   - Request: Issues → Create Issue
   - Body:
     { "title": "Test bug", "description": "Steps...", "type": "BUG" }
   - Copy `id` to `issueId`
2) List Issues
   - Request: Issues → List Issues (verify issue present)
3) Update Issue
   - Request: Issues → Update Issue
   - Body:
     { "status": "IN_PROGRESS" }
   - Expect status update
4) Comments
   - Request: Issues → Create Comment
   - Body:
     { "body": "Investigating" }
   - Request: Issues → List Comments (verify comment)

Wiki Pages
1) Create Page
   - Request: Pages → Create Page
   - Body:
     { "title": "Runbook", "content": "# Steps" }
   - Copy page `id` to `pageId`
2) List Pages (verify page present)
3) Export Page (stub) returns { "status": "queued" }

Sprints
1) Create Sprint
   - Request: Sprints → Create Sprint
   - Body:
     { "name": "Sprint 1", "startDate": "2025-10-05T00:00:00.000Z", "endDate": "2025-10-19T00:00:00.000Z" }
2) List Sprints (verify sprint present)

Attachments (metadata only)
1) Create Attachment
   - Request: Attachments → Create Attachment
   - Body:
     { "projectId": "{{projectId}}", "fileName": "spec.pdf", "mimeType": "application/pdf", "url": "https://example.com/spec.pdf" }
   - Expect 201 with attachment record

RBAC (Org Roles)
1) List Members
   - Request: Organizations → List Members (see current users and roles)
2) Set Role (admin-only)
   - Request: Organizations → Set Role
   - Body:
     { "userId": "<targetUserId>", "role": "ORG_ADMIN" }
3) Remove Member (admin-only)
   - Request: Organizations → Remove Member
   - Body:
     { "userId": "<targetUserId>" }

Password Reset
1) Request Reset
   - Request: Auth → Password Reset Request
   - Body:
     { "email": "qa1@example.com" }
   - Check DB table `PasswordResetToken` for generated token
2) Confirm Reset
   - Request: Auth → Password Reset Confirm
   - Body:
     { "token": "<paste-from-db>", "password": "NewPassw0rd!" }
   - Try Login again with new password

Common Troubleshooting
- 401 Unauthorized: Ensure `token` env var is set to a valid JWT from Login
- 404 Not Found: Confirm you set `orgId`, `projectId`, `issueId`, `pageId` correctly
- CORS: baseUrl must be http://localhost:4000 (no trailing slash)

Audit Logs
1) Trigger Audit Events
   - Create/update an issue
   - Create a comment
2) List Audit Logs (admin-only)
   - Request: Audit -> List Audit Logs
   - Verify that the events from step 1 are present in the response.
   - Test filters (userId, entityType) to narrow down results.

## New Endpoints & Features

- **Full-text Search**
  - `/issues/search?q=...` returns issues matching query
  - `/pages/search?q=...` returns pages matching query

- **Slack Notifications**
  - `/notifications/slack` (POST) with `{ webhookUrl, text }` sends a Slack message

- **Rate Limiting**
  - All endpoints are rate limited to 100 requests/minute per IP

- **OpenTelemetry**
  - Tracing and metrics are enabled; check logs and OTEL collector

- **Attachments**
  - `/attachments` (GET) list attachments
  - `/attachments/:attachmentId` (DELETE) delete attachment
  - `/attachments/presign` (POST) get S3/MinIO presigned upload URL

- **Comments**
  - `/comments/:commentId` (PATCH) edit comment
  - `/comments/:commentId` (DELETE) delete comment

- **Sprints**
  - `/sprints/:sprintId` (PATCH) update sprint
  - `/sprints/:sprintId` (DELETE) delete sprint

- **Validation Errors**
  - All Zod validation errors return RFC7807 problem+json with details
