import express from "express";
import user_router from "./user/user_router";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("FURIAX API");
});

router.use("/user", user_router);

export default router;
