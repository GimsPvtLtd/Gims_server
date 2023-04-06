import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface file {
  fieldname?: string;
  originalname?: string;
  encoding?: string;
  mimetype?: string;
  destination?: string;
  filename?: string;
  path?: string;
  size?: any;
}

declare module "express-serve-static-core" {
  export interface Request {
    user: any
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
  roles: any
) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("Auth failed");
    }
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as any;
    if (roles.includes(decodedToken.user.role)) {
      req.user = await decodedToken.user;
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Auth failed" });
  }
};