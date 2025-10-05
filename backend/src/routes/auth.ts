import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
	email: z.string().email(),
	name: z.string().min(1),
	password: z.string().min(8)
});

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export async function authRoutes(app: FastifyInstance) {
	app.post('/register', async (req, reply) => {
		const parsed = registerSchema.safeParse(req.body);
		if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		const { email, name, password } = parsed.data;
		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) return reply.code(409).send({ error: 'Email already registered' });
		const passwordHash = await bcrypt.hash(password, 12);
		const user = await prisma.user.create({ data: { email, name, passwordHash } });
		return reply.code(201).send({ id: user.id, email: user.email, name: user.name });
	});

	app.post('/login', async (req, reply) => {
		const parsed = loginSchema.safeParse(req.body);
		if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		const { email, password } = parsed.data;
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return reply.code(401).send({ error: 'Invalid credentials' });
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return reply.code(401).send({ error: 'Invalid credentials' });
		const token = app.jwt.sign({ sub: user.id, email: user.email });
		return { token };
	});

	app.get('/me', { preHandler: [app.authenticate as any] }, async (req, reply) => {
		// @ts-ignore
		const userId = req.user?.sub as string | undefined;
		if (!userId) return reply.code(401).send({ error: 'Unauthorized' });
		const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
		return user;
	});
}
