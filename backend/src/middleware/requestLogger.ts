import pinoHttp from "pino-http";
import { v4 as uuidv4 } from "uuid";
import type { IncomingMessage, ServerResponse } from "http";
import type { NextFunction } from "express";

const pinoMiddleware = pinoHttp({
  genReqId: (_req: IncomingMessage, res: ServerResponse) => {
    const id = uuidv4();
    res.setHeader("X-Request-Id", id);
    return id;
  },
  customLogLevel: (_req: IncomingMessage, res: ServerResponse, err?: Error) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  serializers: {
    req: (req: any) => ({ id: req.id, method: req.method, url: req.url }),
    res: (res: any) => ({ statusCode: res.statusCode }),
  },
} as any);

export const requestLogger = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction
) => {
  if ((req as any).method === "OPTIONS") {
    next();
  } else {
    pinoMiddleware(req as any, res as any, next as any);
  }
};
