import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const sendOTPEmail = async (email, generatedOTP) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: "zwlcvyruuougbwyw",
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${generatedOTP}`,
    html: `<p>Your OTP is: ${generatedOTP}</p>`,
  };

  const info = await transporter.sendMail(mailOptions);
};

export { sendOTPEmail };
