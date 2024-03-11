import express from "express";
import auth from "../middleware/auth.js";
import {
  initiatePayment,
  paymentverification,
} from "../controllers/payment.js";

const router = express.Router();

router.post("/createOrder", auth, initiatePayment);
router.post("/paymentverification", paymentverification);


export default router;
