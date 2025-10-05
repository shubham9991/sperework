import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const createProjectSchema = z.object({ orgId: z.string().cuid(), name: z.string().min(1), key: z.string().min(2) });

export async function projectRoutes(app: FastifyInstance) {
	app.get('/orgs/:orgId/projects', { preHandler: [app.authenticate as any] }, async (req) => {
		const orgId = (req.params as any).orgId as string;
		return prisma.project.findMany({ where: { orgId } });
	});

	app.post('/orgs/:orgId/projects', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const orgId = (req.params as any).orgId as string;
		const parsed = createProjectSchema.safeParse({ ...(req.body as any), orgId });
		if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		const proj = await prisma.project.create({ data: parsed.data });
		return reply.code(201).send(proj);
	});
}
