import express from "express";
import { register } from "../../services/auth/register";
import { authorize_twitter } from "../../services/auth/authorize_twitter";

const user_router = express.Router();

user_router.get("/", (req, res) => {
  res.send("FURIAX API - User");
});

// auth
user_router.post("/auth/register", register);
user_router.post("/auth/register/twitter", authorize_twitter);

export default user_router;
