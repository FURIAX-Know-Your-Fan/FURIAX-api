import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/User";

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Token não encontrado" });
    return;
  }

  const verify_token = await jwt.verify(
    token,
    process.env.JWT_AUTH_SECRET as string
  );
  if (!verify_token) {
    res.status(401).json({ message: "Token inválido" });
    return;
  }

  const { id } = jwt.decode(token) as { id: string };

  const user = await User.findById(id);
  if (!user) {
    res.status(401).json({ message: "Usuário não encontrado" });
    return;
  }

  const new_token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_AUTH_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  res
    .status(200)
    .cookie("token", new_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json({
      message: "Token atualizado com sucesso",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        enthusiast_level: user.enthusiast_level,
        twitter_account: user.twitter_account,
        description: user.description,
        answered_questions: user.answered_questions,
        interests: user.interests,
      },
    });
};
