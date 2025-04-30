import { Request, Response } from "express";
import User from "../../models/User";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const {
    username,
    name,
    email,
    password,
    city,
    street,
    cep,
    number,
    state,
    cpf,
    complement,
  } = req.body;

  console.log(req.body);

  if (
    !username ||
    !name ||
    !email ||
    !password ||
    !city ||
    !street ||
    !cep ||
    !number ||
    !state ||
    !cpf ||
    !complement
  ) {
    res.status(400).json({ message: "Todos os campos devem ser preenchidos" });
    return;
  }

  if (await User.findOne({ username })) {
    res.status(400).json({ message: "Nome de usuário já cadastrado" });
    return;
  }

  if (await User.findOne({ email })) {
    res.status(400).json({ message: "Email já cadastrado" });
    return;
  }

  const salt = await bcryptjs.genSalt(10);
  const hashed_password = await bcryptjs.hash(password, salt);

  const new_user = await User.create({
    username,
    name,
    email,
    password: hashed_password,
    adress: {
      city,
      street,
      cep,
      number,
      state,
      complement,
    },
    cpf,
  });

  if (!new_user) {
    res.status(500).json({ message: "Error creating user" });
    return;
  }

  const vincular_token = jwt.sign(
    { id: new_user._id, name: new_user.name, email: new_user.email },
    process.env.JWT_REGISTER_SECRET as string,
    {
      // 30 min
      expiresIn: "30m",
    }
  );

  res.status(201).json({
    message: "Conta criada com sucesso",
    token: vincular_token,
  });
};
