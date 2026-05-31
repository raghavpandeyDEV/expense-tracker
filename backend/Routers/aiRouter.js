import express from "express";
import { categorizeExpense, generateInsights , chatWithExpenses} from "../utils/gemini.js";
import Transaction from "../models/TransactionModel.js";

const router = express.Router();

//  Test route
router.get("/test-ai", async (req, res) => {
  try {
    const category = await categorizeExpense(
      "Swiggy Order"
    );

    res.json({ category });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// NEW INSIGHTS ROUTE
router.post("/insights", async (req, res) => {
  try {

    const { userId } = req.body;

    const transactions = await Transaction.find({
  user: userId,
  transactionType: "expense",
});

const categoryTotals = {};

transactions.forEach((t) => {
  categoryTotals[t.category] =
    (categoryTotals[t.category] || 0) +
    Number(t.amount);
});

console.log(categoryTotals);

const insight =
  await generateInsights(
    categoryTotals
  );

res.json({
  success: true,
  insight,
});

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;

// CHAT WITH EXPENSES ROUTE

router.post("/chat", async (req, res) => {
  try {

    const { userId, question } = req.body;

    const transactions =
      await Transaction.find({
        user: userId
      });

    const answer =
      await chatWithExpenses(
        transactions,
        question
      );

    res.status(200).json({
      success: true,
      answer,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});