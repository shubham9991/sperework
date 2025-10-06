import type { FastifyInstance } from 'fastify';
import { authRoutes } from './routes/auth';
import { orgRoutes } from './routes/orgs';
import { projectRoutes } from './routes/projects';
import { issueRoutes } from './routes/issues';
import { pageRoutes } from './routes/pages';
import { passwordResetRoutes } from './routes/passwordReset';
import { commentRoutes } from './routes/comments';
import { sprintRoutes } from './routes/sprints';
import { attachmentRoutes } from './routes/attachments';
import { billingRoutes } from './routes/billing';
import { roleRoutes } from './routes/roles';
import { teamRoutes } from './routes/teams';

export async function registerRoutes(app: FastifyInstance) {
	app.get('/health', async () => ({ status: 'ok' }));
	await app.register(authRoutes, { prefix: '/api/v1/auth' });
	await app.register(passwordResetRoutes, { prefix: '/api/v1' });
	await app.register(orgRoutes, { prefix: '/api/v1' });
	await app.register(projectRoutes, { prefix: '/api/v1' });
	await app.register(issueRoutes, { prefix: '/api/v1' });
	await app.register(pageRoutes, { prefix: '/api/v1' });
	await app.register(commentRoutes, { prefix: '/api/v1' });
	await app.register(sprintRoutes, { prefix: '/api/v1' });
	await app.register(attachmentRoutes, { prefix: '/api/v1' });
	await app.register(billingRoutes, { prefix: '/api/v1' });
	await app.register(roleRoutes, { prefix: '/api/v1' });
	await app.register(teamRoutes, { prefix: '/api/v1' });
}
