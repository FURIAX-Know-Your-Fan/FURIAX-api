import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/User";

export const authorize_twitter = async (req: Request, res: Response) => {
  const { twitter } = req.body;
  if (!twitter) {
    res.status(400).json({ message: "Twitter não informado" });
    return;
  }
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "Token não encontrado" });
    return;
  }

  // Verifica se o token é válido
  try {
    jwt.verify(token as string, process.env.JWT_REGISTER_SECRET as string);
  } catch (error) {
    res.status(401).json({ message: "Token expirado" });
    return;
  }

  const decoded = jwt.decode(token as string);
  if (!decoded) {
    res.status(401).json({ message: "Token inválido" });
    return;
  }

  const { id, name, email } = decoded as {
    id: string;
    name: string;
    email: string;
  };

  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ message: "Usuário não encontrado" });
    return;
  }

  // Verifica se o Twitter já está vinculado
  if (user.twitter_account) {
    res.status(400).json({ message: "Twitter já vinculado" });
    return;
  }

  // Atualiza o usuário com o Twitter
  user.twitter_account = twitter;
  user.accepted_terms = true;

  await user.save();

  res.status(200).json({
    message: "Twitter vinculado com sucesso",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      twitter_account: user.twitter_account,
    },
  });
};
