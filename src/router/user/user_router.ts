import express from "express";
import { register } from "../../services/auth/register";
import { authorize_twitter } from "../../services/auth/authorize_twitter";
import { login } from "../../services/auth/login";
import { logout } from "../../services/auth/logout";
import { refresh } from "../../services/auth/refresh";
import { create_post } from "../../services/user/posts/create_post";
import { get_posts } from "../../services/user/posts/get_posts";

import { validate_token } from "../../middlewares/jwt/validate_token";
import { like_post } from "../../services/user/posts/like_post";
import { get_post } from "../../services/user/posts/get_post";
import { comment_post } from "../../services/user/posts/comment_post";
import { answer_interests } from "../../services/user/answer_interests";
import { link_twitter } from "../../services/user/link_twitter";
import { link_steam } from "../../services/user/link_steam";
import { get_steam_stats } from "../../services/user/steam/get_steam_status";

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
user_router.post("/posts/like/:post_id", validate_token, like_post);
user_router.get("/posts/:post_id", validate_token, get_post);

// comments
user_router.post("/post/comment/:post_id", validate_token, comment_post);

// interests
user_router.post("/answer/interests", validate_token, answer_interests);

// link accounts
user_router.post("/link/twitter", validate_token, link_twitter);
user_router.post("/link/steam", validate_token, link_steam);

// steam
user_router.get("/steam/:steam_id", get_steam_stats);

export default user_router;
