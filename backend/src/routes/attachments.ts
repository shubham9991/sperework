import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const uploadSchema = z.object({ projectId: z.string().cuid(), issueId: z.string().cuid().optional(), fileName: z.string().min(1), mimeType: z.string().min(1), url: z.string().url() });

export async function attachmentRoutes(app: FastifyInstance) {
	// List attachments endpoint
	app.get('/attachments', { preHandler: [app.authenticate as any] }, async (req) => {
		const projectId = (req.query as any).projectId as string;
		const issueId = (req.query as any).issueId as string | undefined;
		const where: any = { projectId };
		if (issueId) where.issueId = issueId;
		return prisma.attachment.findMany({ where });
	});

	// Delete attachment endpoint
	app.delete('/attachments/:attachmentId', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const attachmentId = (req.params as any).attachmentId as string;
		await prisma.attachment.delete({ where: { id: attachmentId } });
		return reply.send({ status: 'deleted' });
	});
	app.post('/attachments', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const parsed = uploadSchema.safeParse(req.body);
		if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		const att = await prisma.attachment.create({ data: parsed.data });
		return reply.code(201).send(att);
	});
}
