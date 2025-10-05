import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const setRoleSchema = z.object({ userId: z.string().cuid(), role: z.enum(['ORG_ADMIN','ORG_MEMBER','VIEWER']) });

export async function roleRoutes(app: FastifyInstance) {
	app.get('/orgs/:orgId/members', { preHandler: [app.authenticate as any] }, async (req) => {
		const orgId = (req.params as any).orgId as string;
		return prisma.membership.findMany({ where: { orgId }, include: { user: { select: { id: true, email: true, name: true } } } });
	});

	app.post('/orgs/:orgId/members/set-role', { preHandler: [app.authenticate as any, app.authorizeOrg((r)=> (r.params as any).orgId, ['ORG_ADMIN'])] }, async (req, reply) => {
		const orgId = (req.params as any).orgId as string;
		const parsed = setRoleSchema.safeParse(req.body);
		if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		const { userId, role } = parsed.data;
		const m = await prisma.membership.upsert({
			where: { userId_orgId: { userId, orgId } },
			update: { role },
			create: { userId, orgId, role }
		});
		return m;
	});

	app.post('/orgs/:orgId/members/remove', { preHandler: [app.authenticate as any, app.authorizeOrg((r)=> (r.params as any).orgId, ['ORG_ADMIN'])] }, async (req, reply) => {
		const orgId = (req.params as any).orgId as string;
		const body = req.body as any;
		const userId = body?.userId as string;
		if (!userId) return reply.code(400).send({ error: 'userId required' });
		await prisma.membership.delete({ where: { userId_orgId: { userId, orgId } } });
		return { status: 'ok' };
	});
}
