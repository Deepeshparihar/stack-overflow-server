import express from "express";
import { getUploads, uploadFile } from "../controllers/Cards.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

router.use('/uploads', express.static('uploads'));

const upload = multer({ storage });

router.get("/uploads", getUploads);
router.post("/upload", upload.single("file"), uploadFile);

export default router;
