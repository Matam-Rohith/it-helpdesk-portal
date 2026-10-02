import { Router, Response } from 'express';
import { db } from '../db';
import { activeSessions, AuthenticatedRequest, authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = db.findUser(username.trim());

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const { password: _password, ...userWithoutPassword } = user;

  activeSessions.set(token, user);

  return res.json({
    token,
    user: userWithoutPassword,
  });
});

router.get('/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { password: _password, ...userWithoutPassword } = req.user;
  return res.json({ user: userWithoutPassword });
});

router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
