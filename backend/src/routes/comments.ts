import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { createAuditLog } from '../lib/audit';
import { prisma } from '../lib/prisma';

const createCommentSchema = z.object({ issueId: z.string().cuid(), body: z.string().min(1) });

export async function commentRoutes(app: FastifyInstance) {
	// Edit comment endpoint
	app.patch('/comments/:commentId', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const commentId = (req.params as any).commentId as string;
		const body = (req.body as any).body;
		if (!body || typeof body !== 'string' || body.length < 1) {
			return reply.code(400).send({ error: 'Invalid body' });
		}
		const comment = await prisma.comment.update({ where: { id: commentId }, data: { body } });
		return reply.send(comment);
	});

	// Delete comment endpoint
	app.delete('/comments/:commentId', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const commentId = (req.params as any).commentId as string;
		await prisma.comment.delete({ where: { id: commentId } });
		return reply.send({ status: 'deleted' });
	});
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
		await createAuditLog({
			action: 'create-comment',
			userId: (req.user as any).id,
			orgId: (req.user as any).memberships[0].orgId,
			entityId: comment.id,
			entityType: 'comment',
			details: comment,
		});
		return reply.code(201).send(comment);
	});
}
