import { Request, Response, NextFunction } from 'express';

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Mock user - in production, this would come from JWT/session
export const mockUser: User = {
  id: 'user-1',
  name: 'Current User',
  email: 'user@example.com',
  role: 'admin',
};

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Mock authentication - always set mock user
  req.user = mockUser;
  next();
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

export function canEditAgent(agent: { ownerId: string; owners: string[] }, user: User): boolean {
  if (user.role === 'super_admin' || user.role === 'admin') {
    return true;
  }
  if (user.role === 'editor') {
    return agent.ownerId === user.id || agent.owners.includes(user.id);
  }
  return false;
}

