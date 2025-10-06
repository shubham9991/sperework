import fp from 'fastify-plugin';

export default fp(async function errorPlugin(fastify) {
	fastify.setErrorHandler((err, req, reply) => {
		const status = (err.statusCode as number) || 500;
		const problem = {
			type: 'about:blank',
			title: err.name || 'Error',
			status,
			detail: err.message,
			instance: req.url
		};
		reply.code(status).type('application/problem+json').send(problem);
	});
});
