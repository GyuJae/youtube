import { Request, Response } from "express";
import UserModel from "../models/User";

export const getJoin = async (req: Request, res: Response): Promise<any> => {
  try {
    return res.render("join", { pageTitle: "Create Account" });
  } catch {
    return res.redirect("/");
  }
};

export const postJoin = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      body: { name, username, email, password, location },
    } = req;
    await UserModel.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch {
    return res.redirect("/");
  }
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
