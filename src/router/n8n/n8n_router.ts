import express from "express";
import { get_users_id } from "../../services/n8n/get_users_id";

const n8n_router = express.Router();

n8n_router.get("/users_data", get_users_id);

export default n8n_router;
