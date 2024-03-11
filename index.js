import express from "express"; // server type module instead of commonjs
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import uploadRoutes from "./routes/Cards.js";
import path from "path";
import paymentRoutes from "./routes/payment.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
dotenv.config();

//middlewares
app.use(express.json({ limit: "30mb", extended: true })); // not a static API , Rest API
app.use(express.static(path.join(__dirname, "public")));
//we will recieve reqests only through json and response only with help of json
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// use cors so both port can't give any error while interacting with each other

app.get("/", (req, res) => {
  res.send("This is a Stack overflow clone API");
});

//middlewares
app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);
app.use("/api", uploadRoutes);
app.use("/payment", paymentRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

const DATABASE_URL = process.env.CONNECTION_URL;

mongoose
  .connect(DATABASE_URL)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    })
  )
  .catch((err) => console.log(err.message));
