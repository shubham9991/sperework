import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { paginate } from '../lib/pagination';

const auditQuerySchema = z.object({
  userId: z.string().optional(),
  entityType: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.string().optional().default('1'),
  perPage: z.string().optional().default('20'),
});

export default async function auditRoutes(fastify: FastifyInstance) {
  fastify.get('/audit', {
    preHandler: [
      fastify.authenticate,
      fastify.authorizeOrg(
        (req) => req.user.memberships[0].orgId,
        ['ORG_ADMIN']
      )
    ],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          entityType: { type: 'string' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          page: { type: 'string', default: '1' },
          perPage: { type: 'string', default: '20' }
        },
        required: [],
        additionalProperties: false
      }
    },
  }, async (request, reply) => {
    const query = request.query as z.infer<typeof auditQuerySchema>;
    const orgId = request.user.memberships[0].orgId;

    const where: any = { orgId };
    if (query.userId) where.userId = query.userId;
    if (query.entityType) where.entityType = query.entityType;
    if (query.startDate && query.endDate) {
      where.createdAt = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };
    }

    const page = parseInt(query.page, 10);
    const perPage = parseInt(query.perPage, 10);

    const paginatedAuditLogs = await paginate(fastify.prisma.auditLog, {
      where,
      orderBy: { createdAt: 'desc' },
    }, { page, perPage });

    return reply.send(paginatedAuditLogs);
  });
}
