import type { Request, Response, NextFunction } from 'express';
import { Role } from '../router/router.ts';

export interface AuthRequest extends Request {
	user?: {
		roles: string[];
	};
}

function authorizeRoles(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (allowedRoles.includes(Role.PUBLIC)) {
      return next();
    }
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user info' });
    }

    const hasRole = req.user.roles.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
}

export default authorizeRoles;
