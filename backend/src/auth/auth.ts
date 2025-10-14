import type { Request, Response, NextFunction } from 'express';
import { Role } from '../router/router.ts';
import { authenticateToken } from './token.ts';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username?: string;
    role: string;
  };
}

function authorizeRoles(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (allowedRoles.includes(Role.PUBLIC)) {
      return next();
    }

    // Authenticate Bearer token
    const authHeader = req.headers.authorization || req.headers.Authorization as string | undefined;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(400).json({ message: 'Bad Request: Malformed Authorization header' });
    }

    const token = parts[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const payload = authenticateToken(token);
    if (!payload) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }

    req.user = {
      userId: payload.userId,
      username: payload.username,
      role: payload.role as string,
    };

    // Authorization: check user role
    const hasRole = typeof req.user.role === 'string' && allowedRoles.includes(req.user.role);
    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
}

export default authorizeRoles;
