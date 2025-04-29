import { Request, Response } from "express";
import Post from "../../../models/Post";

export const get_posts = async (req: Request, res: Response) => {
  // ordena pelos mais recentes
  const posts = await Post.find().sort({ createdAt: -1 }).populate({
    path: "user",
    select: "name username email enthusiast_level",
  });

  // incrementar visualizações
  for (const post of posts) {
    if (!post.visualized_by.includes(req.body.user_id)) {
      post.visualizations += 1;
      post.visualized_by.push(req.body.user_id);
      await post.save();
    }
  }

  if (!posts) {
    res.status(500).json({ message: "Erro ao buscar posts" });
    return;
  }

  res.status(200).json({
    posts: posts,
  });
};
