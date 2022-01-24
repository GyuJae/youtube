import { NextFunction, Request, Response } from "express";

export const protectorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session?.loggedIn) {
    return next();
  }
  req.flash("error", "Not authorized");
  return res.redirect("/");
};

export const publicOnlyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.loggedIn) {
    return next();
  }
  req.flash("error", "Not authorized");
  return res.redirect("/");
};
