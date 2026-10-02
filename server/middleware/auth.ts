import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { User } from '../../src/types';

// In-memory active sessions map: token -> User
export const activeSessions = new Map<string, User>();

// Seed initial session tokens for ease of testing if needed
for (const u of [db.findUser('admin'), db.findUser('employee'), db.findUser('engineer')]) {
  if (u) {
    activeSessions.set(`token_${u.username}`, u);
  }
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.substring(7).trim();
  const sessionUser = activeSessions.get(token);

  if (!sessionUser) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }

  req.user = sessionUser;
  next();
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const sessionUser = activeSessions.get(token);
    if (sessionUser) {
      req.user = sessionUser;
    }
  }
  next();
};
