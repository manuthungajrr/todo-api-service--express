import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // const token = req.header("Authorization")?.split(" ")[1];
  next();
  // if (!token) {
  //   res.status(401).json({ message: "Unauthorized" });
  //   return;
  // }

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
  //     userId: number;
  //   };
  //   req.body.userId = decoded.userId;
  //   next();
  // } catch (error) {
  //   res.status(401).json({ message: "Invalid Token" });
  //   return;
  // }
};

export default authMiddleWare;
