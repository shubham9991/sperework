import fp from 'fastify-plugin';
import type { FastifyReply, FastifyRequest } from 'fastify';

export default fp(async function authPlugin(fastify) {
	fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
		try {
			await request.jwtVerify();
		} catch (err) {
			return reply.code(401).send({ error: 'Unauthorized' });
		}
	});
});
