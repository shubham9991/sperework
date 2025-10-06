import { startOtel } from './lib/otel';
startOtel();
import rateLimitPlugin from './plugins/rateLimit';
// ...existing code...
// Register rate limit plugin after server initialization
import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { registerRoutes } from './routes';
import authPlugin from './plugins/auth';
import securityHeaders from './plugins/security';
import rbac from './plugins/rbac';
import errors from './plugins/errors';
import requestId from './plugins/requestId';
import { checkOpenSearchConnection } from './lib/opensearch';

const server = Fastify({
	logger: {
		 transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
		 level: 'info'
	}
});

await server.register(requestId);

await server.register(cors, {
	origin: process.env.CORS_ORIGIN?.split(',') || true,
	credentials: true
});

await server.register(jwt, {
	secret: process.env.JWT_SECRET || 'change-me',
	sign: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
});

await server.register(authPlugin);
await server.register(securityHeaders);
await server.register(rbac);
await server.register(errors);

await registerRoutes(server);

const openSearchOk = await checkOpenSearchConnection();
if (!openSearchOk) {
	console.warn('Warning: OpenSearch connection failed. Continuing without OpenSearch.');
}

const port = Number(process.env.PORT || 4000);
server.listen({ port, host: '127.0.0.1' }).catch((err) => {
	server.log.error(err);
	process.exit(1);
});
