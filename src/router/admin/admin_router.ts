import express from "express";
import { get_dashboard_statistics } from "../../services/admin/statistics/get_dashboard_statistics";

const admin_router = express.Router();

admin_router.get("/dashboard/statistics", get_dashboard_statistics);

export default admin_router;
