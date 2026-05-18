import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JwtPayload, UserRole } from '../types';
import { sendError } from '../utils/response';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Access denied. No token provided.', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
    next();
  } catch {
    sendError(res, 'Invalid or expired token.', 401);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(
        res,
        `Role '${req.user.role}' is not authorized for this action.`,
        403
      );
      return;
    }

    next();
  };
};
