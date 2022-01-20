import express from "express";
import {
  finishGithubLogin,
  getChangePassword,
  getEdit,
  logout,
  postChangePassword,
  postEdit,
  remove,
  startGithubLogin,
  see,
} from "../controllers/user.controller";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
} from "../middlewares/loggedMiddleware.middleware";
import { avatarUpload } from "../middlewares/uploadFile.middleware";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/remove", protectorMiddleware, remove);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/callback", publicOnlyMiddleware, finishGithubLogin);
userRouter.route("/:id([0-9a-f]{24})").get(see);

export default userRouter;
