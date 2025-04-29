import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    adress: {
      type: String,
      required: true,
    },
    cpf: {
      type: String,
      required: true,
    },
    interests: {
      type: [String],
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    twitter_account: {
      type: String,
      required: false,
    },
    accepted_terms: {
      type: Boolean,
      default: false,
    },
    enthusiast_level: {
      type: String,
      enum: ["Não Medido", "Casual", "Engajado", "Hardcore"],
      default: "Não Medido",
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    collection: "users",
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
