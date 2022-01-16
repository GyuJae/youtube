import express, { Application } from "express";
import morgan from "morgan";
import globalRouter from "./routers/global.router";
import userRouter from "./routers/user.router";
import videoRouter from "./routers/video.router";

const app: Application = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
