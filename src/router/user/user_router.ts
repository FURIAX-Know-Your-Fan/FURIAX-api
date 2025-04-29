import express from "express";
import { register } from "../../services/auth/register";
import { authorize_twitter } from "../../services/auth/authorize_twitter";
import { login } from "../../services/auth/login";
import { logout } from "../../services/auth/logout";
import { refresh } from "../../services/auth/refresh";
import { create_post } from "../../services/user/posts/create_post";
import { get_posts } from "../../services/user/posts/get_posts";

import { validate_token } from "../../middlewares/jwt/validate_token";

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

// posts
user_router.post("/post", create_post);
user_router.get("/posts", validate_token, get_posts);
export default user_router;
