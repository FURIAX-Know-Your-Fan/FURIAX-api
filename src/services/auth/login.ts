import { Request, Response } from "express";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Preencha todos os campos" });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: "Usuário não encontrado" });
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401).json({ message: "Credenciais inválidas" });
    return;
  }

  const token = jwt.sign(
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
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json({
      message: "Login realizado com sucesso",
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
