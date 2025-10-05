import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const setProviderSchema = z.object({ provider: z.enum(['razorpay']), keyId: z.string().min(1), keySecret: z.string().min(1) });

export async function billingRoutes(app: FastifyInstance) {
	app.get('/billing/subscription/:orgId', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const orgId = (req.params as any).orgId as string;
		const sub = await prisma.subscription.findUnique({ where: { orgId }, include: { plan: true } });
		if (!sub) return reply.code(404).send({ error: 'No subscription' });
		return sub;
	});

	app.post('/billing/provision-default', { preHandler: [app.authenticate as any] }, async () => {
		const plan = await prisma.plan.upsert({
			where: { code: 'GROWTH_MONTHLY' },
			update: {},
			create: { code: 'GROWTH_MONTHLY', name: 'Growth Monthly', priceCents: 1999, currency: 'INR', interval: 'MONTH' }
		});
		return plan;
	});

	app.post('/billing/start-trial/:orgId', { preHandler: [app.authenticate as any] }, async (req) => {
		const orgId = (req.params as any).orgId as string;
		const now = new Date();
		const trialEnds = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
		const sub = await prisma.subscription.upsert({
			where: { orgId },
			update: { status: 'TRIAL', trialEndsAt: trialEnds },
			create: { orgId, status: 'TRIAL', trialEndsAt: trialEnds }
		});
		return sub;
	});

	app.post('/billing/set-provider/:orgId', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		const orgId = (req.params as any).orgId as string;
		const parsed = setProviderSchema.safeParse(req.body);
		if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		const cfg = await prisma.paymentProviderConfig.upsert({
			where: { orgId },
			update: { provider: parsed.data.provider, keyId: parsed.data.keyId, keySecret: parsed.data.keySecret },
			create: { orgId, provider: parsed.data.provider, keyId: parsed.data.keyId, keySecret: parsed.data.keySecret }
		});
		return cfg;
	});
}
