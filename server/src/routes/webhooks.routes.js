import express from "express";
import { clerkController } from "../controllers/clerk.controller.js";

const router = express.Router()

router.post("/clerk", clerkController )

export default router