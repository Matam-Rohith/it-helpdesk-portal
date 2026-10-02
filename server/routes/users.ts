import { Router, Response } from 'express';
import { db } from '../db';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/users - list users (for assignment dropdowns, contact info)
router.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { role } = req.query;
  const users = db.listUsers(role as string);
  return res.json(users);
});

export default router;
