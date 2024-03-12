import express from "express";
import { getUploads, uploadFile } from "../controllers/Cards.js";
import multer from "multer";
import { getStorage } from "firebase/storage";

const router = express.Router();

const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/uploads", getUploads);
router.post("/upload", upload.single("file"), uploadFile);

export default router;
