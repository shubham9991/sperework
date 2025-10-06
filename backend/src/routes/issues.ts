import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { parsePagination, toPrismaArgs } from '../lib/pagination';

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
		const { page, pageSize, sortBy, sortOrder } = parsePagination(req.query as any);
		const { skip, take, orderBy } = toPrismaArgs({ page, pageSize, sortBy, sortOrder });
		const [items, total] = await Promise.all([
			prisma.issue.findMany({ where: { projectId }, skip, take, orderBy: orderBy as any }),
			prisma.issue.count({ where: { projectId } })
		]);
		return { items, page, pageSize, total };
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
