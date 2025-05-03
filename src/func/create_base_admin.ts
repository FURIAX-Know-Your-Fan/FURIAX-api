import bcrypt from "bcryptjs";
import User from "../models/User";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../utils/constants";

export const create_base_admin = async () => {
  if (ADMIN_EMAIL === undefined) {
    throw new Error("ADMIN_EMAIL is not defined");
  }
  if (ADMIN_PASSWORD === undefined) {
    throw new Error("ADMIN_PASSWORD is not defined");
  }

  if (await User.findOne({ email: ADMIN_EMAIL })) {
    console.log("Admin already exists");
    return;
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

  const new_admin = await User.create({
    name: "Admin",
    username: "admin",
    adress: {
      cep: "00000000",
      city: "Admin",
      street: "Admin",
      state: "Admin",
      complement: "Admin",
      number: "0",
    },
    cpf: "00000000000",
    interests: [],
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
  });

  if (!new_admin) {
    throw new Error("Failed to create admin");
  }

  console.log("Admin created successfully");
};
