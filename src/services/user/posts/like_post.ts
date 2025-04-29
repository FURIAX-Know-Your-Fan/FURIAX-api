import { Request, Response } from "express";
import Post from "../../../models/Post";

export const like_post = async (req: Request, res: Response) => {
  const { post_id } = req.params;
  const user_id = req.body.user_id;

  // Verifica se o post existe
  const post = await Post.findById(post_id);
  if (!post) {
    res.status(404).json({ message: "Post não encontrado" });
    return;
  }

  // Verifica se o usuário já deu like no post
  if (post.likes.includes(user_id)) {
    res.status(400).json({ message: "Você já deu like nesse post" });
    return;
  }

  // Adiciona o like ao post
  post.likes.push(user_id);
  post.likes_count += 1;

  // Salva o post
  await post.save();
  res.status(200).json({ message: "Post curtido com sucesso!" });
};
