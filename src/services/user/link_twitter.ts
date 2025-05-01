import { Request, Response } from "express";
import User from "../../models/User";

export const link_twitter = async (req: Request, res: Response) => {
  const { twitter_account, user_id } = req.body;

  if (!user_id) {
    res.status(400).json({
      message: "Campos obrigatórios não preenchidos (Servidor)",
    });
    return;
  }

  if (!twitter_account) {
    res.status(400).json({
      message: "Digite a sua conta do Twitter",
    });
    return;
  }

  const user = await User.findById(user_id);
  if (!user) {
    res.status(404).json({
      message: "Usuário não encontrado",
    });
    return;
  }

  user.twitter_account = twitter_account;
  await user.save();

  res.status(200).json({
    message: "Conta do Twitter vinculada com sucesso",
  });
};
