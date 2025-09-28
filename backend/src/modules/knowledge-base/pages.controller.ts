import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/v1/knowledge-base/pages - Create a new wiki page
router.post('/knowledge-base/pages', async (req: Request, res: Response) => {
  const { title, content, workspaceId, authorId } = req.body;
  try {
    const page = await prisma.page.create({
      data: { title, content, workspaceId, authorId },
    });
    res.status(201).json({ page });
  } catch (err) {
    res.status(400).json({ error: 'Page creation failed', details: err });
  }
});

// GET /api/v1/knowledge-base/pages - List all wiki pages
router.get('/knowledge-base/pages', async (req: Request, res: Response) => {
  try {
    const pages = await prisma.page.findMany();
    res.json({ pages });
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch pages', details: err });
  }
});

export default router;
