import Razorpay from "razorpay";
import Payment from "../models/payment.js";
import crypto from "crypto";

const instance = new Razorpay({
  key_id: "rzp_test_vP9XgMpTDWdTS4",
  key_secret: "7xb8Nq26eQ5duJDcXtotfwDP",
});

export const initiatePayment = async (req, res) => {
  try {
    const adjustedAmount = req.body.adjustedAmount;
    const order = await instance.orders.create({
      amount: Number(adjustedAmount * 100),
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 1,
    });

    res.json({ order_id: order.id });
  } catch (error) {
    // Handle error
    console.error("Error initiating payment:", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};

export const paymentverification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const amount = req.query.amount;
  const userName = req.query.userName;
  const userId = req.query.userId;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedsgnature = crypto
    .createHmac("sha256", "7xb8Nq26eQ5duJDcXtotfwDP")
    .update(body.toString())
    .digest("hex");
  const isauth = expectedsgnature === razorpay_signature;

  if (isauth) {
    try {
      const newMember = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        userName,
        userId,
      });
      await newMember.save();
      res.redirect(
        "https://stackoverflow-bydeepesh.netlify.app/Subscription?message=Payment%20successful"
      );
    } catch (error) {
      console.error("Error updating payment details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    console.error("Payment failed:", order_id);
    res.redirect(
      "https://stackoverflow-bydeepesh.netlify.app/Subscription?message=Payment%20failed"
    );
  }
};
