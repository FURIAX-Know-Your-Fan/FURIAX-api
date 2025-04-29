import { Request, Response } from "express";
import Post from "../../../models/Post";
import Comment from "../../../models/Comment";

export const comment_post = async (req: Request, res: Response) => {
  const { post_id } = req.params;
  const { content, user_id } = req.body;

  if (!content) {
    res.status(400).json({
      message: "Preencha o conteúdo para comentar",
    });
    return;
  }

  if (!post_id) {
    res.status(400).json({
      message: "Preencha o id do post para comentar",
    });
    return;
  }

  if (!user_id) {
    res.status(400).json({
      message: "Preencha o id do usuário para comentar",
    });
    return;
  }

  const post = await Post.findById(post_id);
  if (!post) {
    res.status(404).json({
      message: "Post não encontrado",
    });
    return;
  }

  const comment = await Comment.create({
    content,
    user: user_id,
    post_id: post_id,
  });
  if (!comment) {
    res.status(500).json({
      message: "Erro ao criar comentário",
    });
    return;
  }

  post.comments.push(comment._id);

  post.comments_count = post.comments_count + 1;

  await post.save();

  res.status(200).json({
    message: "Comentário criado com sucesso",
    comment,
  });
};
