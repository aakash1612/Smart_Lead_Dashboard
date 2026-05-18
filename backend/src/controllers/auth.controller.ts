import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest, JwtPayload } from '../types';
import { sendSuccess, sendError } from '../utils/response';

const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, 'Email already registered.', 409);
      return;
    }

    const user = await User.create({ name, email, password, role });
    const payload: JwtPayload = { id: user.id, role: user.role, email: user.email };
    const token = generateToken(payload);

    sendSuccess(
      res,
      'Registration successful.',
      { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      201
    );
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendError(res, 'Invalid email or password.', 401);
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 'Invalid email or password.', 401);
      return;
    }

    const payload: JwtPayload = { id: user.id, role: user.role, email: user.email };
    const token = generateToken(payload);

    sendSuccess(res, 'Login successful.', {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      sendError(res, 'User not found.', 404);
      return;
    }
    sendSuccess(res, 'User fetched.', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    next(err);
  }
};
