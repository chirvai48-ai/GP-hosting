import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

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
