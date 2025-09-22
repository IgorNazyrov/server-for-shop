import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET not configured");
    return res.status(500).json({ error: "Error server" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number };

    req.user = { userId: decoded.userId };

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.clearCookie('access_token');
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};