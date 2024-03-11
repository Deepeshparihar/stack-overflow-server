import express from "express";
import auth from "../middleware/auth.js";
import {
  AskQuestion,
  getAllQuestions,
  deleteQuestion,
  voteQuestion,
  getQuestionCountToday,
  getCurrentUserAmount,
} from "../controllers/Questions.js";

const router = express.Router();

router.post("/Ask", auth, AskQuestion);
router.get("/get", getAllQuestions);
router.delete("/delete/:id", auth, deleteQuestion);
router.patch("/vote/:id", auth, voteQuestion);
router.get("/question-count-today/:userId", getQuestionCountToday);
router.get("/current-user-amount/:userId", getCurrentUserAmount);

export default router;
