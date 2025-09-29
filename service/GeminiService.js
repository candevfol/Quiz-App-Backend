import { GoogleGenAI } from "@google/genai";
const base_prompt = `
    You are an evaluator for a quiz application.

    Question: {question}
    Submitted Answer: {submitted_answer}
    Correct Answer: {correct_answer}

    Task:
    - Compare the submitted answer with the correct answer.
    - Focus on meaning, intent, and correctness, not exact wording.
    - Both answers are short (≤ 30 words).
    - If the submitted answer matches the correct answer by at least 75% in meaning, return only "true".
    - Otherwise, return only "false".
    - Do not provide explanations, just return "true" or "false".
  `;

const ai = new GoogleGenAI({});

const create_prompt = (userAnswer, correctAnswer, question) => {
  return base_prompt
    .replace("{question}", question)
    .replace("{submitted_answer}", userAnswer)
    .replace("{correct_answer}", correctAnswer);
};

async function compare_answer(submitted_answer, correct_answer, question) {
  const prompt = create_prompt(submitted_answer, correct_answer, question);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt,
  });
  return response.text;
}

export { compare_answer };
