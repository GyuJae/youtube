import { NextFunction, Request, Response } from "express";

const localMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.locals.loggedIn = Boolean(req.session?.loggedIn);
  res.locals.siteName = "Youtube";
  res.locals.loggedInUser = req.session?.user || null;
  next();
};

export default localMiddleware;
