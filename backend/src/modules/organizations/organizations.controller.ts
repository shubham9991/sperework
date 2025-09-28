import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/v1/orgs - Create a new organization
router.post('/', async (req: Request, res: Response) => {
  const { name, ownerId } = req.body;
  try {
    const org = await prisma.organization.create({
      data: { name, ownerId },
    });
    res.status(201).json({ organization: org });
  } catch (err) {
    res.status(400).json({ error: 'Organization creation failed', details: err });
  }
});

// GET /api/v1/orgs/:orgId - Get organization details
router.get('/:orgId', async (req: Request, res: Response) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.params.orgId },
      include: { users: true, workspaces: true, teams: true },
    });
    if (!org) return res.status(404).json({ error: 'Organization not found' });
    res.json({ organization: org });
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch organization', details: err });
  }
});

// PATCH /api/v1/orgs/:orgId - Update organization settings
router.patch('/:orgId', async (req: Request, res: Response) => {
  try {
    const org = await prisma.organization.update({
      where: { id: req.params.orgId },
      data: req.body,
    });
    res.json({ organization: org });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update organization', details: err });
  }
});

// GET /api/v1/orgs/:orgId/users - List all users in the organization
router.get('/:orgId/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { organizationId: req.params.orgId },
    });
    res.json({ users });
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch users', details: err });
  }
});

export default router;
