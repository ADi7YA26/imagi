import express from "express";
import { clerkController } from "../controllers/clerk.controller.js";
import bodyParser from "body-parser"

const router = express.Router()

router.post("/clerk", bodyParser.raw({type: 'application/json'}), clerkController )

export default router