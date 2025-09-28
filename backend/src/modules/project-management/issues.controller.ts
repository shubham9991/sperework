import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/v1/workspaces/:workspaceId/issues - Create a new issue
router.post('/workspaces/:workspaceId/issues', async (req: Request, res: Response) => {
  const { title, description, status, type, priority, assigneeId, reporterId } = req.body;
  try {
    // Find the next issueId for this workspace
    const lastIssue = await prisma.issue.findFirst({
      where: { workspaceId: req.params.workspaceId },
      orderBy: { issueId: 'desc' },
    });
    const nextIssueId = lastIssue ? lastIssue.issueId + 1 : 1;
    const issue = await prisma.issue.create({
      data: {
        issueId: nextIssueId,
        title,
        description,
        status,
        type,
        priority,
        assigneeId,
        reporterId,
        workspaceId: req.params.workspaceId,
      },
    });
    res.status(201).json({ issue });
  } catch (err) {
    res.status(400).json({ error: 'Issue creation failed', details: err });
  }
});

// GET /api/v1/workspaces/:workspaceId/issues - List issues
router.get('/workspaces/:workspaceId/issues', async (req: Request, res: Response) => {
  try {
    const issues = await prisma.issue.findMany({
      where: { workspaceId: req.params.workspaceId },
    });
    res.json({ issues });
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch issues', details: err });
  }
});

export default router;
