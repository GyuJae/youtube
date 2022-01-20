import { Request, Response } from "express";
import UserModel from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import VideoModel from "../models/Video";

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

export const getEdit = async (req: Request, res: Response): Promise<any> => {
  try {
    return res.render("editProfile", { pageTitle: "Edit Profile" });
  } catch {
    return res.redirect("/");
  }
};

export const postEdit = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      session,
      body: { name, email, username, location },
      file,
    } = req;
    const updatedUser = await UserModel.findByIdAndUpdate(
      session?.user._id,
      {
        name,
        email,
        username,
        location,
        avatarUrl: file ? file.path : session?.user.avatarUrl,
      },
      { new: true }
    );
    if (req.session) {
      req.session.user = updatedUser;
    }
    return res.redirect("/");
  } catch (error) {
    return res.redirect("/");
  }
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
    const user = await UserModel.findOne({ username, socialOnly: false });
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

export const logout = async (req: Request, res: Response): Promise<any> => {
  if (req.session) {
    req.session.destroy(() => {
      req.session;
    });
  }
  return res.redirect("/");
};

export const see = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      params: { id },
    } = req;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.render("404", { pageTitle: "User not found" });
    }
    const videos = await VideoModel.find({ owner: user._id });
    return res.render("profile", { pageTitle: user.name, user, videos });
  } catch {
    return res.redirect("/");
  }
};

export const startGithubLogin = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
      client_id: process.env.GITHUB_CLIENT || "",
      allow_signup: "false",
      scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = baseUrl + "?" + params;
    console.log("Final URL :", finalUrl);
    return res.redirect(finalUrl);
  } catch {
    return res.redirect("/login");
  }
};

export const finishGithubLogin = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
      client_id: process.env.GITHUB_CLIENT || "",
      client_secret: process.env.GITHUB_SECRET || "",
      code: (req.query.code as string) || "",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = baseUrl + "?" + params;
    const tokenRequest = await (
      await fetch(finalUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      })
    ).json();
    if ("access_token" in tokenRequest) {
      const { access_token } = tokenRequest;
      const apiUrl = "https://api.github.com";
      const userData = await (
        await fetch(`${apiUrl}/user`, {
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
      ).json();
      const emailData = await (
        await fetch(`${apiUrl}/user/emails`, {
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
      ).json();
      interface IEmailObj {
        email: string;
        primary: boolean;
        verified: boolean;
        visibility: string | null;
      }
      const emailObj: IEmailObj = emailData.find(
        (email: IEmailObj) => email.primary === true && email.verified === true
      );
      if (!emailObj) {
        return res.redirect("/login");
      }
      let user = await UserModel.findOne({ email: emailObj.email });
      if (!user) {
        user = await UserModel.create({
          name: userData.name,
          username: userData.login,
          email: emailObj.email,
          password: "",
          socialOnly: true,
          location: userData.location,
          avatarUrl: userData.avatar_url,
        });
      }
      if (req.session) {
        req.session.loggedIn = true;
        req.session.user = user;
      }
      return res.redirect("/");
    } else {
      return res.redirect("/login");
    }
  } catch {
    return res.redirect("/login");
  }
};

export const getChangePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    if (req.session?.user.socialOnly) {
      return res.redirect("/");
    }
    return res.render("changePassword", { pageTitle: "Change Password" });
  } catch (error) {
    return res.redirect("/");
  }
};

export const postChangePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      session,
      body: { oldPassword, newPassword, newPassword2 },
    } = req;
    const pageTitle = "Change Password";
    const user = await UserModel.findById(session?.user._id);
    if (!user) {
      return res.status(400).render("404", { pageTitle: "404" });
    }
    const ok = await bcrypt.compare(oldPassword, user?.password);
    if (!ok) {
      return res.status(400).render("changePassword", {
        pageTitle,
        errorMessage: "The current password is incorrect",
      });
    }
    if (newPassword !== newPassword2) {
      return res.status(400).render("changePassword", {
        pageTitle,
        errorMessage: "The password does not match the confirmation",
      });
    }
    user.password = await bcrypt.hash(newPassword, BCRYPT_SALT);
    await user.save();
    return res.redirect("/users/logout");
  } catch (error) {
    return res.redirect("/");
  }
};
