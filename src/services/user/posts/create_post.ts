import { Request, Response } from "express";
import Post from "../../../models/Post";
import User from "../../../models/User";

export const create_post = async (req: Request, res: Response) => {
  const { user_id, content } = req.body;
  if (!user_id) {
    res.status(400).json({ message: "Campos essenciais não preenchidos" });
    return;
  }

  if (!content) {
    res.status(400).json({ message: "Escreva algo para Postar" });
    return;
  }

  if (!(await User.findById(user_id))) {
    res.status(400).json({ message: "Usuário não encontrado" });
    return;
  }

  const new_post = await Post.create({
    user: user_id,
    content,
  });

  if (!new_post) {
    res.status(500).json({ message: "Erro ao criar post" });
    return;
  }

  res.status(201).json({
    message: "Post criado com sucesso",
    post: new_post,
  });
};
