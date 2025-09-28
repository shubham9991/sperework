import { Router, Request, Response } from 'express';
import { IdentityService } from './identity.service';

const router = Router();
const identityService = new IdentityService();

// POST /api/v1/identity/register
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const user = await identityService.register(email, password, firstName, lastName);
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed', details: err });
  }
});

// POST /api/v1/identity/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await identityService.validatePassword(email, password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const token = identityService.generateJWT(user);
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: 'Login failed', details: err });
  }
});

export default router;
