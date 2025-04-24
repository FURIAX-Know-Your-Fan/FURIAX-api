import express from "express";
import { register } from "../../services/auth/register";
import { authorize_twitter } from "../../services/auth/authorize_twitter";
import { login } from "../../services/auth/login";
import { logout } from "../../services/auth/logout";
import { refresh } from "../../services/auth/refresh";

const user_router = express.Router();

user_router.get("/", (req, res) => {
  res.send("FURIAX API - User");
});

// auth
user_router.post("/auth/register", register);
user_router.post("/auth/register/twitter", authorize_twitter);
user_router.post("/auth/login", login);
user_router.post("/auth/logout", logout);
user_router.get("/auth/refresh", refresh);

export default user_router;
