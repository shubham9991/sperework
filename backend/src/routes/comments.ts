import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const createCommentSchema = z.object({ issueId: z.string().cuid(), body: z.string().min(1) });

export async function commentRoutes(app: FastifyInstance) {
	app.get('/issues/:issueId/comments', { preHandler: [app.authenticate as any] }, async (req) => {
		const issueId = (req.params as any).issueId as string;
		return prisma.comment.findMany({ where: { issueId }, orderBy: { createdAt: 'asc' }, include: { author: { select: { id: true, name: true } } } });
	});

	app.post('/issues/:issueId/comments', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const issueId = (req.params as any).issueId as string;
		const parsed = createCommentSchema.safeParse({ ...(req.body as any), issueId });
		if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		// @ts-ignore
		const userId = req.user?.sub as string;
		const comment = await prisma.comment.create({ data: { issueId, authorId: userId, body: parsed.data.body } });
		return reply.code(201).send(comment);
	});
}
