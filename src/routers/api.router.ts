import express from "express";
import { createComment, registerView } from "../controllers/video.controller";
import { protectorMiddleware } from "../middlewares/loggedMiddleware.middleware";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post(
  "/videos/:id([0-9a-f]{24})/comment",
  protectorMiddleware,
  createComment
);

export default apiRouter;
