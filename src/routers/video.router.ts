import express from "express";
import {
  remove,
  watch,
  getUpload,
  postUpload,
  getEdit,
  postEdit,
} from "../controllers/video.controller";
import { protectorMiddleware } from "../middlewares/loggedMiddleware.middleware";
import { videoUpload } from "../middlewares/uploadFile.middleware";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", protectorMiddleware, remove);
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);

export default videoRouter;
