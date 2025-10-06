import fp from 'fastify-plugin';
import { randomUUID } from 'node:crypto';

export default fp(async function requestIdPlugin(fastify) {
	fastify.addHook('onRequest', async (req, reply) => {
		const reqId = (req.headers['x-request-id'] as string) || randomUUID();
		req.headers['x-request-id'] = reqId;
		reply.header('x-request-id', reqId);
	});
});
