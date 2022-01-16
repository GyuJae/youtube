import express from "express";
import { getJoin, login, postJoin } from "../controllers/user.controller";
import { search, home } from "../controllers/video.controller";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/login", login);
rootRouter.get("/search", search);

export default rootRouter;
