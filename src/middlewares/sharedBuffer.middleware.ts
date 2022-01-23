import { NextFunction, Request, Response } from "express";

export const sharedbufferMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
};
