import express from "express";
import { getUserById, updateCredits } from "../controllers/user.controller.js";
import { getUserImages } from "../controllers/image.controller.js";

const router = express.Router()

router.get('/:id', getUserById)
router.post('/updateCredit', updateCredits)
router.get('/:userId/images', getUserImages)

export default router