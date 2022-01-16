import { Request, Response } from "express";
import VideoModel from "../models/Video";

export const home = async (req: Request, res: Response): Promise<void> => {
  try {
    const videos = await VideoModel.find({}).limit(10);

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
    console.log(video);
    return res
      .status(200)
      .render("watch", { pageTitle: video?.title || "Watch", video });
  } catch {
    return res.redirect("/");
  }
};

export const edit = async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "Edit",
  });
};

export const search = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(200).send({
    message: "search",
  });
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
    // throw new Error("error bye bye")
    await VideoModel.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word: string) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", { pageTitle: "Upload", errorMessage: error });
  }
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(200).send({
    message: "remove",
  });
};
