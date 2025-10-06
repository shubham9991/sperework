import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import axios from 'axios';

const slackSchema = z.object({ webhookUrl: z.string().url(), text: z.string().min(1) });

export async function slackRoutes(app: FastifyInstance) {
  app.post('/notifications/slack', { preHandler: [app.authenticate as any] }, async (req, reply) => {
    const parsed = slackSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
    try {
      await axios.post(parsed.data.webhookUrl, { text: parsed.data.text });
      return { status: 'sent' };
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Failed to send Slack notification' });
    }
  });
}
