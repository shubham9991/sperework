import fp from 'fastify-plugin';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';

export type OrgRole = 'ORG_ADMIN' | 'ORG_MEMBER' | 'VIEWER';

async function hasOrgRole(userId: string, orgId: string, allowed: OrgRole[]): Promise<boolean> {
	const m = await prisma.membership.findUnique({ where: { userId_orgId: { userId, orgId } } });
	if (!m) return false;
	return allowed.includes(m.role as OrgRole);
}

export default fp(async function rbacPlugin(fastify) {
	fastify.decorate('authorizeOrg', function (getOrgId: (req: FastifyRequest) => string, allowed: OrgRole[]) {
		return async function (request: FastifyRequest, reply: FastifyReply) {
			// @ts-ignore
			const userId = request.user?.sub as string | undefined;
			if (!userId) return reply.code(401).send({ error: 'Unauthorized' });
			const orgId = getOrgId(request);
			const ok = await hasOrgRole(userId, orgId, allowed);
			if (!ok) return reply.code(403).send({ error: 'Forbidden' });
		};
	});
});
