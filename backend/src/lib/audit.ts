import { prisma } from './prisma';

interface AuditLogData {
  action: string;
  userId: string;
  orgId: string;
  entityId: string;
  entityType: string;
  details?: Record<string, any>;
}

export const createAuditLog = async (data: AuditLogData) => {
  return await prisma.auditLog.create({
    data: {
      ...data,
      details: data.details || undefined,
    },
  });
};
