import express from "express";
import { getUserById, updateCredits } from "../controllers/user.controller.js";

const router = express.Router()

router.get('/:id', getUserById)
router.post('/updateCredit', updateCredits)

export default router