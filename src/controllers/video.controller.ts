import { Request, Response } from "express";
import CommentModel from "../models/Comment";
import UserModel from "../models/User";
import VideoModel from "../models/Video";
import makeHashtags from "../utils/makeHashtags";

const VIDEO_NOT_FOUND = "Video not Found.";

export const home = async (req: Request, res: Response): Promise<void> => {
  try {
    const videos = await VideoModel.find({})
      .limit(10)
      .sort({ createdAt: "desc" });

    return res.status(200).render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.status(404).render("404", { pageTitle: "Error" });
  }
};

export const watch = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      params: { id },
      session,
    } = req;
    const video = await VideoModel.findById(id);
    if (!video) {
      return res.status(404).render("404", { pageTitle: VIDEO_NOT_FOUND });
    }
    const comments = await CommentModel.find({ videoId: id });
    const resultComments = await Promise.all(
      comments.map(async (comment) => {
        const user = await UserModel.findById(comment.ownerId);
        return {
          id: comment._id,
          username: user?.username,
          avatarUrl: user?.avatarUrl,
          payload: comment.payload,
          createdAt: comment.createdAt,
        };
      })
    );
    let owner = false;
    if (session && session.user) {
      if (video.owner.toString() === session.user._id) {
        owner = true;
      }
    }
    return res.status(200).render("watch", {
      pageTitle: video?.title || "Watch",
      video,
      owner,
      comments: resultComments,
    });
  } catch (error) {
    req.flash("error", `Error: ${error}`);
    return res.redirect("/");
  }
};

export const getEdit = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      params: { id },
    } = req;
    if (!id) {
      return res.status(404).render("404", { pageTitle: VIDEO_NOT_FOUND });
    }
    const video = await VideoModel.findById(id);
    if (!video) {
      return res.status(404).render("404", { pageTitle: VIDEO_NOT_FOUND });
    }

    return res
      .status(200)
      .render("editVideo", { pageTitle: "Edit " + video.title, video: video });
  } catch (error) {
    req.flash("error", `Error: ${error}`);
    return res.redirect("/");
  }
};

export const postEdit = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      params: { id },
    } = req;
    if (!id) {
      req.flash("error", "This video id wrong;;");
      return res.redirect("/");
    }
    const video = await VideoModel.exists({ _id: id });
    if (!video) {
      return res.redirect("/");
    }
    const {
      body: { title, description, hashtags },
    } = req;
    await VideoModel.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: makeHashtags(hashtags),
    });
    req.flash("success", `Success Edit Video!`);
    return res.redirect(`/videos/${id}`);
  } catch (error) {
    req.flash("error", `Error: ${error}`);
    return res.redirect("/");
  }
};

export const search = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      query: { keyword },
    } = req;
    if (!keyword) {
      req.flash("error", "Please put keyword");
      return res.redirect("/");
    }
    const videos = await VideoModel.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    });
    return res.status(200).render("search", { pageTitle: keyword, videos });
  } catch (error) {
    req.flash("error", `Error: ${error}`);
    return res.redirect("/");
  }
};

export const getUpload = async (req: Request, res: Response): Promise<any> => {
  try {
    return res.status(200).render("upload", { pageTitle: "Upload" });
  } catch (error) {
    req.flash("error", `Error: ${error}`);
    return res.render("404", { pageTitle: "Error" });
  }
};

export const postUpload = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, description, hashtags } = req.body;
    const { session } = req;
    const {
      files: { video, thumbnail },
    } = req;
    await VideoModel.create({
      title,
      description,
      hashtags: makeHashtags(hashtags),
      fileUrl: video[0].path,
      owner: session?.user._id,
      thumbnail: thumbnail[0].path,
    });
    req.flash("success", `Success Upload Video!`);
    return res.redirect("/");
  } catch (error) {
    req.flash("error", `Error: ${error}`);
    return res.status(400).render("upload", { pageTitle: "Upload" });
  }
};

export const remove = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      params: { id },
      session,
    } = req;
    if (!id) {
      req.flash("error", "This video id is wrong.");
      return res.redirect("/");
    }
    const video = await VideoModel.findById(id);
    if (!video) {
      req.flash("error", "This video is not exist.");
      return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner) !== String(session?.user._id)) {
      req.flash("error", `Not authorized`);
      return res.status(403).redirect("/");
    }
    await VideoModel.findByIdAndDelete(id);
    req.flash("success", `Success Delete Video!`);
    return res.redirect("/");
  } catch (error) {
    req.flash("error", `Error: ${error}`);
    return res.redirect("/");
  }
};

export const registerView = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      params: { id },
    } = req;
    if (!id) {
      return res.sendStatus(404);
    }
    const video = await VideoModel.findById(id);
    if (!video) {
      return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(404);
  }
};

export const createComment = async (req: Request, res: Response) => {
  const { session, body, params } = req;
  const video = await VideoModel.findById(params.id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await CommentModel.create({
    payload: body.text,
    videoId: params.id,
    ownerId: session?.user._id,
  });
  return res.sendStatus(201);
};
