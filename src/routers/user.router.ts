import express from "express";
import { edit, logout, remove, see } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/:id([0-9a-f]{24})", see);

export default userRouter;
