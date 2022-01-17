import { Request, Response } from "express";
import UserModel from "../models/User";
import bcrypt from "bcrypt";

const BCRYPT_SALT = 10;
const USER_ERROR = "User Error occured.";

export const getJoin = async (req: Request, res: Response): Promise<any> => {
  try {
    return res.render("join", { pageTitle: "Create Account" });
  } catch {
    return res.redirect("/");
  }
};

export const postJoin = async (req: Request, res: Response): Promise<any> => {
  try {
    const pageTitle = "Join";
    const {
      body: { name, username, email, password, password2, location },
    } = req;
    const uesrnameExist = await UserModel.exists({ username });
    if (uesrnameExist) {
      return res.status(400).render("join", {
        pageTitle,
        errorMessage: "This Username already exist",
      });
    }
    const emailExist = await UserModel.exists({ email });
    if (emailExist) {
      return res.status(400).render("join", {
        pageTitle,
        errorMessage: "This Email already exist",
      });
    }
    if (password !== password2) {
      return res.status(400).render("join", {
        pageTitle,
        errorMessage: "Password not equal.",
      });
    }
    await UserModel.create({
      name,
      username,
      email,
      password: await bcrypt.hash(password, BCRYPT_SALT),
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

export const getLogin = async (req: Request, res: Response): Promise<any> => {
  return res.status(200).render("login", { pageTitle: "Login" });
};

export const postLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const pageTitle = "Login";
    const {
      body: { username, password },
    } = req;
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).render("login", {
        pageTitle,
        errorMessage: "An account with this username does not exists.",
      });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).render("login", {
        pageTitle,
        errorMessage: "Wrong password",
      });
    }
    if (req.session) {
      req.session.loggedIn = true;
      req.session.user = user;
    }
    return res.redirect("/");
  } catch (error) {
    return res.status(404).render("404", { pageTitle: USER_ERROR });
  }
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
