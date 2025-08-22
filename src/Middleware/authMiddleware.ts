import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import StatusCode from "../Config/StatusCode.js";

interface AuthRequest extends Request {
  user?: { id: string };
}

const JWT_key = process.env.JWT_key;
if (!JWT_key) {
  throw new Error("JWT_key environment variable is not set");
}

export const userOnly = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(StatusCode.UNAUTHORIZED).json({
        message: "No token provided, access denied",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(StatusCode.UNAUTHORIZED).json({
        message: "Invalid token format",
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_key) as JwtPayload;

    if (!decoded || typeof decoded !== "object" || !("id" in decoded) || typeof decoded.id !== "string") {
      res.status(StatusCode.UNAUTHORIZED).json({
        message: "Invalid token payload",
      });
      return;
    }

    req.user = { id: decoded.id };
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(StatusCode.UNAUTHORIZED).json({ 
        message: "Token has expired" 
      });
    } else if (error.name === "JsonWebTokenError") {
      res.status(StatusCode.UNAUTHORIZED).json({ 
        message: "Invalid token" 
      });
    } else {
      res.status(StatusCode.UNAUTHORIZED).json({ 
        message: "Token verification failed" 
      });
    }
  }
};