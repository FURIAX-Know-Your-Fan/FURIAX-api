import { Request, Response } from "express";

export const logout = async (req: Request, res: Response) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logout realizado com sucesso" });
};
