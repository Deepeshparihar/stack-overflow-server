import express from "express";
import Questions from "../models/Questions.js";
import mongoose from "mongoose";
import Payment from "../models/payment.js";
import axios from "axios";

export const AskQuestion = async (req, res) => {
  const postQuestionData = req.body;

  try {
    const { currentUserAmount, questionCountToday } = req.body;
    const dailyQuestionLimit = calculateDailyQuestionLimit(currentUserAmount);

    if (questionCountToday >= dailyQuestionLimit) {
      return res
        .status(400)
        .json({ message: "You have reached your daily question limit." });
    }

    const postQuestion = new Questions(postQuestionData);

    await postQuestion.save();
    res.status(200).json("Posted a question succesfully");
  } catch (error) {
    console.log(error);
    res.status(409).json("Couldn't post a new question");
  }
};

export const calculateDailyQuestionLimit = (currentUserAmount) => {
  if (currentUserAmount === 100) {
    return 5; // 5 questions per day for 100 amount plan
  } else if (currentUserAmount === 1000) {
    return Infinity; // Unlimited questions per day for 1000 amount plan
  } else {
    return 1; // Default plan: 1 question per day
  }
};

export const getQuestionCountToday = async (req, res) => {
  try {
    const userId = req.params.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await Questions.countDocuments({
      userId,
      askedOn: { $gte: today.toISOString() },
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUserAmount = async (req, res) => {
  try {
    const payment = await Payment.findOne({ userId: req.params.userId });
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }
    res.json({ amount: payment.amount });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const questionList = await Questions.find();
    res.status(200).json(questionList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavilable...");
  }
  try {
    await Questions.findByIdAndDelete(_id);
    res.status(200).json({ message: "successfully deleted..." });
  } catch (error) {
    console.log(error);
  }
};

export const voteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value } = req.body;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavilable...");
  }

  try {
    const question = await Questions.findById(_id);
    const upIndex = question.upVote.findIndex((id) => id === String(userId));
    const downIndex = question.downVote.findIndex(
      (id) => id === String(userId)
    );

    if (value === "upVote") {
      if (downIndex !== -1) {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
      if (upIndex === -1) {
        question.upVote.push(userId);
      } else {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
    } else if (value === "downVote") {
      if (upIndex !== -1) {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
      if (downIndex === -1) {
        question.downVote.push(userId);
      } else {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
    }
    await Questions.findByIdAndUpdate(_id, question);
    res.status(200).json({ message: "voted successfully..." });
  } catch (error) {
    console.log(error);
  }
};
