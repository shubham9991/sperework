import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const createPageSchema = z.object({ projectId: z.string().cuid(), title: z.string().min(1), content: z.string().default('') });

export async function pageRoutes(app: FastifyInstance) {
	// Full-text search endpoint using OpenSearch
	app.get('/pages/search', { preHandler: [app.authenticate as any] }, async (req) => {
		const q = (req.query as any).q as string;
		if (!q) return { items: [], total: 0 };
		try {
			const { body } = await app.opensearch.search({
				index: 'pages',
				body: {
					query: {
						multi_match: {
							query: q,
							fields: ['title', 'content']
						}
					}
				}
			});
			const items = body.hits.hits.map((hit: any) => hit._source);
			return { items, total: body.hits.total.value };
		} catch (err) {
			app.log.error(err);
			return { items: [], total: 0 };
		}
	});
	app.get('/projects/:projectId/pages', { preHandler: [app.authenticate as any] }, async (req) => {
		const projectId = (req.params as any).projectId as string;
		return prisma.page.findMany({ where: { projectId } });
	});

	app.post('/projects/:projectId/pages', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const projectId = (req.params as any).projectId as string;
		const parsed = createPageSchema.safeParse({ ...(req.body as any), projectId });
		if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		const page = await prisma.page.create({ data: parsed.data });
		return reply.code(201).send(page);
	});

	app.patch('/pages/:pageId', { preHandler: [app.authenticate as any] }, async (req) => {
		const pageId = (req.params as any).pageId as string;
		return prisma.page.update({ where: { id: pageId }, data: req.body as any });
	});

	app.post('/pages/:pageId/export', { preHandler: [app.authenticate as any] }, async () => {
		return { status: 'queued' };
	});
}
