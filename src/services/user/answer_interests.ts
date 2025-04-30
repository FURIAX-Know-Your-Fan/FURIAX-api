import { Request, Response } from "express";
import User from "../../models/User";

export const answer_interests = async (req: Request, res: Response) => {
  const { user_id, interests } = req.body;
  if (!user_id || !interests) {
    res.status(400).json({
      message: "Campos obrigatórios não preenchidos (Servidor)",
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
  user.answered_questions = true;
  user.interests = interests;

  await user.save();

  res.status(200).json({
    message: "Interesses respondidos com sucesso",
  });
};
