import express from "express";
import {
  edit,
  finishGithubLogin,
  logout,
  remove,
  see,
  startGithubLogin,
} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/callback", finishGithubLogin);
userRouter.get("/:id([0-9a-f]{24})", see);

export default userRouter;
