import fp from 'fastify-plugin';

export default fp(async function errorPlugin(fastify) {
	   fastify.setErrorHandler((err, req, reply) => {
		   let status = (err.statusCode as number) || 500;
		   let detail = err.message;
		   if (err?.name === 'ZodError' && err?.issues) {
			   status = 400;
			   detail = err.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join('; ');
		   }
		   const problem = {
			   type: 'about:blank',
			   title: err.name || 'Error',
			   status,
			   detail,
			   instance: req.url
		   };
		   reply.code(status).type('application/problem+json').send(problem);
	   });
});
