import { Request, Response } from "express";
import Post from "../../../models/Post";

export const get_post = async (req: Request, res: Response) => {
  const { post_id } = req.params;
  if (!post_id) {
    res.status(400).json({ message: "Identificador não achado" });
    return;
  }

  const post = await Post.findById(post_id)
    .populate({
      path: "user",
      select: "username name email enthusiast_level",
    })
    .populate({
      path: "comments",
      select: "content user createdAt",
      populate: {
        path: "user",
        select: "_id name username email enthusiast_level",
      },
    })
    .populate({
      path: "likes",
      select: "username name email enthusiast_level",
    });
  if (!post) {
    res.status(404).json({ message: "Post não encontrado" });
    return;
  }

  res.status(200).json({ message: "Post encontrado", post });
};
