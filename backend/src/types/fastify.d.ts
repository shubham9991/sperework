import 'fastify';
import type { FastifyReply, FastifyRequest } from 'fastify';

declare module 'fastify' {
	interface FastifyInstance {
		authenticate: any;
		authorizeOrg: (getOrgId: (req: FastifyRequest) => string, allowed: Array<'ORG_ADMIN' | 'ORG_MEMBER' | 'VIEWER'>) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
	}
}
