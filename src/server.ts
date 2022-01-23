import express, { Application } from "express";
import morgan from "morgan";
import session from "express-session";
import apiRouter from "./routers/api.router";
import rootRouter from "./routers/root.router";
import userRouter from "./routers/user.router";
import videoRouter from "./routers/video.router";
import localMiddleware from "./middlewares/localMiddleware.middleware";
import MongoStore from "connect-mongo";

const app: Application = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET || "",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }) as unknown as session.Store,
  })
);

app.use("/uploads", express.static("uploads"));
app.use(
  "/static",
  express.static("assets"),
  express.static("node_modules/@ffmpeg/core/dist")
);
app.use(localMiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/apis", apiRouter);

export default app;
