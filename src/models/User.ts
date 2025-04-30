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
      cep: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      complement: {
        type: String,
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
    },
    cpf: {
      type: String,
      required: true,
    },
    interests: {
      type: [String],
      required: false,
      default: [],
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
    answered_questions: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "users",
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
