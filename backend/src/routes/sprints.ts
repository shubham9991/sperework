import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const sprintSchema = z.object({ projectId: z.string().cuid(), name: z.string().min(1), startDate: z.string().datetime().optional(), endDate: z.string().datetime().optional() });

export async function sprintRoutes(app: FastifyInstance) {
	// Update sprint endpoint
	app.patch('/sprints/:sprintId', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const sprintId = (req.params as any).sprintId as string;
		const data = req.body as any;
		const sprint = await prisma.sprint.update({ where: { id: sprintId }, data });
		return reply.send(sprint);
	});

	// Delete sprint endpoint
	app.delete('/sprints/:sprintId', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const sprintId = (req.params as any).sprintId as string;
		await prisma.sprint.delete({ where: { id: sprintId } });
		return reply.send({ status: 'deleted' });
	});
	app.get('/projects/:projectId/sprints', { preHandler: [app.authenticate as any] }, async (req) => {
		const projectId = (req.params as any).projectId as string;
		return prisma.sprint.findMany({ where: { projectId }, orderBy: { createdAt: 'asc' } });
	});

	app.post('/projects/:projectId/sprints', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const projectId = (req.params as any).projectId as string;
		const parsed = sprintSchema.safeParse({ ...(req.body as any), projectId });
		if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		const { name, startDate, endDate } = parsed.data as any;
		const sprint = await prisma.sprint.create({ data: { projectId, name, startDate: startDate ? new Date(startDate) : null, endDate: endDate ? new Date(endDate) : null } });
		return reply.code(201).send(sprint);
	});
}
