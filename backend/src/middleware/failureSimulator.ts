import { Request, Response, NextFunction } from "express";

let counter = 0;
const rate = Number(process.env.FAILURE_RATE) || 3;

export default function failureSimulator(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (
    ["POST", "PATCH", "DELETE"].includes(req.method) &&
    req.path !== "/batch"
  ) {
    counter += 1;
    if (counter % rate === 0) {
      res.setHeader("Retry-After", "0");
      res
        .status(503)
        .json({ message: "Simulated failure", code: "SIMULATED_FAILURE" });
      return;
    }
  }
  next();
}
