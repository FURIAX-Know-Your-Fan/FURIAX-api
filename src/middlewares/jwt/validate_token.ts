import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/User";

export const validate_token = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Token não encontrado" });
    return;
  }

  const validate = (await jwt.verify(
    token,
    process.env.JWT_AUTH_SECRET as string
  )) as jwt.JwtPayload;
  if (!validate) {
    res.status(401).json({ message: "Token inválido" });
    return;
  }

  if (!(await User.findById(validate.id))) {
    res.status(401).json({ message: "Usuário não encontrado" });
    return;
  }

  req.body = req.body || {};
  req.body.user_id = validate.id;

  next();
};
