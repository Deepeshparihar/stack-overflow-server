// controllers said to use to handle reqests like localhost:3000/users/signup
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import users from "../models/auth.js";
import { sendOTPEmail } from "../services/otpService.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (existinguser) {
      return res.status(404).json({ message: "User already Exist." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await users.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json("Something went wrong...");
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existinguser = await users.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User don't Exist." });
    }

    const isPasswordCrt = await bcrypt.compare(password, existinguser.password);
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: existinguser.email, id: existinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: existinguser, token });
  } catch (error) {
    res.status(500).json("Something went wrong...");
  }
};

export const otpStorage = new Map();

export const sendOTP = async (req, res) => {
  try {
    const { email, generatedOTP } = req.body;
    otpStorage.set(email, generatedOTP);
    await sendOTPEmail(email, generatedOTP);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

export const verifyOTP = (req, res) => {
  try {
    const { email, enteredOTP } = req.body;
    let isOTPVerified = true;
    const storedOTP = otpStorage.get(email);
    if (storedOTP && enteredOTP === storedOTP) {
      otpStorage.delete(email);

      res.status(200).json({
        success: true,
        message: "Verification successful",
        isOTPVerified,
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
      isOTPVerified = false;
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};
