import express from "express";
import {
  edit,
  remove,
  watch,
  getUpload,
  postUpload,
} from "../controllers/video.controller";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.get("/:id([0-9a-f]{24})/edit", edit);
videoRouter.get("/:id([0-9a-f]{24})/delete", remove);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
