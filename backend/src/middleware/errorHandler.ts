import { Request, Response, NextFunction } from "express";

export default function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[Error] ${_req.method} ${_req.originalUrl}`, err);
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
}
