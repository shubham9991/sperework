import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

const requestSchema = z.object({ email: z.string().email() });
const confirmSchema = z.object({ token: z.string().min(10), password: z.string().min(8) });

export async function passwordResetRoutes(app: FastifyInstance) {
	   app.post('/auth/password/reset/request', async (req, reply) => {
		   const parsed = requestSchema.safeParse(req.body);
		   if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		   const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
		   if (user) {
			   const token = crypto.randomBytes(24).toString('hex');
			   await prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt: new Date(Date.now() + 1000 * 60 * 30) } });
			   // Send password reset email
			   const { sendMail, renderTemplate } = await import('../lib/email');
			   const link = `${process.env.CORS_ORIGIN}/reset-password?token=${token}`;
			   const html = renderTemplate('reset', { link });
			   await sendMail({ to: user.email, subject: 'Password Reset', html });
		   }
		   return { status: 'ok' };
	   });

	app.post('/auth/password/reset/confirm', async (req, reply) => {
		const parsed = confirmSchema.safeParse(req.body);
		if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
		const row = await prisma.passwordResetToken.findUnique({ where: { token: parsed.data.token } });
		if (!row || row.used || row.expiresAt < new Date()) return reply.code(400).send({ error: 'Invalid token' });
		const passwordHash = await bcrypt.hash(parsed.data.password, 12);
		await prisma.$transaction([
			prisma.user.update({ where: { id: row.userId }, data: { passwordHash } }),
			prisma.passwordResetToken.update({ where: { id: row.id }, data: { used: true } })
		]);
		return { status: 'ok' };
	});
}
