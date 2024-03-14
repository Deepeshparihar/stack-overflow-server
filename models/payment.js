import mongoose from "mongoose";

const paymentschema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  planDate: {
    type: Date,
    default: Date.now,
  },
});

paymentschema.index({ planDate: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.model("Payment", paymentschema);
