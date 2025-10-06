import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

export default fp(async function rateLimitPlugin(fastify) {
  fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    allowList: [],
  });
});
