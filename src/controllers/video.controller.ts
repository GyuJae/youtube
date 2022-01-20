import { Request, Response } from "express";
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
    } = req;
    const video = await VideoModel.findById(id);
    if (!video) {
      return res.status(404).render("404", { pageTitle: VIDEO_NOT_FOUND });
    }
    return res
      .status(200)
      .render("watch", { pageTitle: video?.title || "Watch", video });
  } catch {
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
  } catch {
    return res.redirect("/");
  }
};

export const postEdit = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      params: { id },
    } = req;
    if (!id) {
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
    return res.redirect(`/videos/${id}`);
  } catch (error) {
    return res.redirect("/");
  }
};

export const search = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      query: { keyword },
    } = req;
    if (!keyword) {
      return res.redirect("/");
    }
    const videos = await VideoModel.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    });
    return res.status(200).render("search", { pageTitle: keyword, videos });
  } catch {
    return res.redirect("/");
  }
};

export const getUpload = async (req: Request, res: Response): Promise<any> => {
  try {
    return res.status(200).render("upload", { pageTitle: "Upload" });
  } catch {
    return res.render("404", { pageTitle: "Error" });
  }
};

export const postUpload = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, description, hashtags } = req.body;
    const { session } = req;
    const { file } = req;
    await VideoModel.create({
      title,
      description,
      hashtags: makeHashtags(hashtags),
      fileUrl: file?.path,
      owner: session?.user._id,
    });
    return res.redirect("/");
  } catch (error) {
    return res
      .status(400)
      .render("upload", { pageTitle: "Upload", errorMessage: error });
  }
};

export const remove = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      params: { id },
      session,
    } = req;
    if (!id) {
      return res.redirect("/");
    }
    const video = await VideoModel.findById(id);
    if (!video) {
      return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner) !== String(session?.user._id)) {
      return res.status(403).redirect("/");
    }
    await VideoModel.findByIdAndDelete(id);
    return res.redirect("/");
  } catch {
    return res.redirect("/");
  }
};
