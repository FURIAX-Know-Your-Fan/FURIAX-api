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
  },
  {
    collection: "users",
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
