import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const createTeamSchema = z.object({ name: z.string().min(1) });
const addMemberSchema = z.object({ userId: z.string().cuid(), role: z.string().default('MEMBER') });

export async function teamRoutes(app: FastifyInstance) {
	app.get('/orgs/:orgId/teams', { preHandler: [app.authenticate as any] }, async (req) => {
		const orgId = (req.params as any).orgId as string;
		return prisma.team.findMany({ where: { orgId } });
	});

	app.post('/orgs/:orgId/teams', { preHandler: [app.authenticate as any, app.authorizeOrg((r)=> (r.params as any).orgId, ['ORG_ADMIN'])] }, async (req, reply) => {
		const orgId = (req.params as any).orgId as string;
		const parsed = createTeamSchema.safeParse(req.body);
		if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		const team = await prisma.team.create({ data: { orgId, name: parsed.data.name } });
		return reply.code(201).send(team);
	});

	app.post('/teams/:teamId/members', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const teamId = (req.params as any).teamId as string;
		const parsed = addMemberSchema.safeParse(req.body);
		if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		const tm = await prisma.teamMembership.upsert({
			where: { teamId_userId: { teamId, userId: parsed.data.userId } },
			update: { role: parsed.data.role },
			create: { teamId, userId: parsed.data.userId, role: parsed.data.role }
		});
		return reply.code(201).send(tm);
	});

	app.delete('/teams/:teamId/members/:userId', { preHandler: [app.authenticate as any] }, async (req) => {
		const { teamId, userId } = req.params as any;
		await prisma.teamMembership.delete({ where: { teamId_userId: { teamId, userId } } });
		return { status: 'ok' };
	});
}
