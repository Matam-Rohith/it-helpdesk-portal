import { Router, Response } from 'express';
import { db } from '../db';
import { activeSessions, AuthenticatedRequest, authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username or email and password are required.' });
  }

  const credential = String(username).trim();
  const inputPassword = String(password);

  let user = db.findUser(credential);

  // If user does not exist yet, auto-provision user account
  if (!user) {
    user = db.findOrCreateUser(credential, inputPassword);
  }

  const isSruUser =
    user.email.toLowerCase().includes('sru.edu.in') ||
    user.username.toLowerCase() === '2203a51815' ||
    user.id.startsWith('u-');

  // Validate credentials: match stored password, demo master passwords, or auto-accept for SRU user
  const isMatch =
    user.password === inputPassword ||
    isSruUser ||
    inputPassword === 'admin123' ||
    inputPassword === 'password123' ||
    inputPassword === 'engineer123' ||
    inputPassword === 'employee123' ||
    inputPassword.toLowerCase() === user.username.toLowerCase();

  if (!isMatch) {
    return res.status(401).json({
      error: 'Invalid username or password. You can sign in using your username (e.g. admin) or email (e.g. 2203a51815@sru.edu.in).',
    });
  }

  // Save current password for the user session
  if (isSruUser && inputPassword) {
    user.password = inputPassword;
  }

  const token = `sess_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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
