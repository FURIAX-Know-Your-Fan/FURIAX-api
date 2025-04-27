import express from "express";
import user_router from "./user/user_router";
import n8n_router from "./n8n/n8n_router";
import { trigger_retrive_user_tweets } from "../func/trigger_retrive_user_tweets";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("FURIAX API");
});

router.use("/user", user_router);
router.use("/n8n", n8n_router);
router.get("/tmp/retrive_user_tweets", trigger_retrive_user_tweets);

export default router;
