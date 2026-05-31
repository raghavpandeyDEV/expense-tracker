import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function categorizeExpense(description) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
Categorize this expense:

${description}

Categories:
Food
Transport
Shopping
Bills
Entertainment
Healthcare
Education

Return only the category name.
`,
  });

  return response.text.trim();
}

//INSIGHTS 


export async function generateInsights(categoryTotals) {

  const response =
    await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: `
Analyze this spending summary in Indian Rupees (₹):

${JSON.stringify(categoryTotals)}

Return ONLY this format:

Highest Spending: ...
Spending Pattern: ...
Money Saving Suggestion: ...

No markdown.
No ** symbols.
No numbering.
`
    });

  return response.text;
}

//CHAT WITH EXPENSES

export async function chatWithExpenses(
  transactions,
  question
) {

  const response =
    await ai.models.generateContent({
      model: "gemini-2.0-flash",

      contents: `
You are a financial assistant.

Transaction Data:
${JSON.stringify(transactions)}

User Question:
${question}

Rules:
- Use ONLY the transaction data provided.
- If information is unavailable, say "I don't have enough data."
- Do not make assumptions.
- Keep answers under 80 words.
`
    });

  return response.text;
}