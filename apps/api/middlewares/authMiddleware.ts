import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role?: string };
}

interface JwtPayload {
  userId: string;
}

export const verifyJWT = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const auth = req.headers.authorization;
    console.log(auth);
    

    if (!auth || !auth.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const token = auth.split(' ')[1];
    console.log("token: ",token);
    if (!token) {
      res.status(401).json({ error: 'Token missing' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    console.log("decoded: ",decoded);
    

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    console.log("user: ",user);
    

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    console.log("req.user: ",req.user);

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token', err });
  }
};

export const requireRoles = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role || '')) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }

    next();
    return Promise<void>;
  };
};