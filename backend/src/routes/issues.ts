import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const createIssueSchema = z.object({
	projectId: z.string().cuid(),
	title: z.string().min(1),
	description: z.string().optional(),
	type: z.enum(['EPIC', 'STORY', 'TASK', 'BUG', 'SUBTASK']),
	status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional()
});

export async function issueRoutes(app: FastifyInstance) {
	app.get('/projects/:projectId/issues', { preHandler: [app.authenticate as any] }, async (req) => {
		const projectId = (req.params as any).projectId as string;
		return prisma.issue.findMany({ where: { projectId } });
	});

	app.post('/projects/:projectId/issues', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const projectId = (req.params as any).projectId as string;
		const parsed = createIssueSchema.safeParse({ ...(req.body as any), projectId });
		if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		const issue = await prisma.issue.create({ data: { ...parsed.data, description: parsed.data.description || '' } });
		return reply.code(201).send(issue);
	});

	app.patch('/issues/:issueId', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const issueId = (req.params as any).issueId as string;
		const body = req.body as any;
		const issue = await prisma.issue.update({ where: { id: issueId }, data: body });
		return issue;
	});
}
