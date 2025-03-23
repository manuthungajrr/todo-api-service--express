import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    req.body.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export default authMiddleWare;
