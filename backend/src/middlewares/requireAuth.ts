import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      admin?: { id: string; email: string; role?: string | null };
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    req.admin = {
      id: session.user.id,
      email: session.user.email,
      role: (session.user as { role?: string | null }).role ?? null,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid session" });
  }
};

// Allows sign-up only to create the very first admin (bootstrap), or to an
// already-authenticated admin thereafter. Prevents public self-registration
// while avoiding a chicken-and-egg lockout on a fresh database.
export const requireAuthUnlessNoAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) return next();
  return requireAuth(req, res, next);
};
