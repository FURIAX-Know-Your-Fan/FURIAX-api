import { Request, Response } from "express";
import User from "../../models/User";

export const get_users_id = async (req: Request, res: Response) => {
  const users = await User.find().select("_id");

  res.status(200).json(users);
};
