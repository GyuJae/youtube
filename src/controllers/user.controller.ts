import { Request, Response } from "express";

export const join = async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "Join",
  });
};

export const edit = async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "Edit",
  });
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(200).send({
    message: "remove",
  });
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "login",
  });
};

export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(200).send({
    message: "logout",
  });
};

export const see = async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "see",
  });
};
