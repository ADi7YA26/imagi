import express from "express";
import { addImage, updateImage, deleteImage, getImageById, getAllImages, getUserImages } from "../controllers/image.controller.js";

const router = express.Router()

router.post('/', addImage)
router.put('/', updateImage)
router.delete('/:imageId', deleteImage)
router.get('/:imageId', getImageById)
router.post('/allImage', getAllImages)

export default router