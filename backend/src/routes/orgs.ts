import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const createOrgSchema = z.object({ name: z.string().min(1), slug: z.string().min(3) });

export async function orgRoutes(app: FastifyInstance) {
	app.post('/orgs', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const parsed = createOrgSchema.safeParse(req.body);
		if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		const org = await prisma.organization.create({ data: parsed.data });
		return reply.code(201).send(org);
	});

	app.get('/orgs/:orgId', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const orgId = (req.params as any).orgId as string;
		const org = await prisma.organization.findUnique({ where: { id: orgId } });
		if (!org) return reply.code(404).send({ error: 'Not found' });
		return org;
	});
}
