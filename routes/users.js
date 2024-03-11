//file for authentication - posting reqests
import express from "express";
import { login, signup, sendOTP, verifyOTP } from "../controllers/auth.js";
import { getAllUsers, updateProfile } from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router(); // creating express router

router.post("/signup", signup);
router.post("/login", login);

router.get("/getAllUsers", getAllUsers);
router.patch("/update/:id", auth, updateProfile);

router.post("/send", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router;
