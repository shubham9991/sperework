import fp from 'fastify-plugin';

export default fp(async function securityHeaders(fastify) {
	fastify.addHook('onSend', async (req, reply, payload) => {
		reply.header('X-Content-Type-Options', 'nosniff');
		reply.header('X-Frame-Options', 'DENY');
		reply.header('Referrer-Policy', 'no-referrer');
		reply.header('X-XSS-Protection', '0');
		reply.header('Content-Security-Policy', "default-src 'self'");
		return payload;
	});
});
