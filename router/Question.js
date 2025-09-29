import express from "express";
import { question_schema } from "../utils/Schema.Zod.js";
import {
  create_question,
  find_all_question,
} from "../service/QuestionService.js";

const questionRouter = express.Router();

questionRouter.post("/:id", async (req, res, next) => {
  const validationResult = question_schema.safeParse(req.body);
  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    return res.bad_request("Validation failed", errorMessages);
  }
  try {
    const quizId = parseInt(req.params.id, 10);

    const questions = await create_question(quizId, req.body);

    if (!questions.success) return res.not_found(`Quiz not found`);

    return res.created(`Questions created!`);
  } catch (err) {
    next(err);
  }
});
questionRouter.get("/:id", async (req, res, next) => {
  try {
    const quizId = parseInt(req.params.id, 10);

    const questions = await find_all_question(quizId);

    if (!questions.success) return res.not_found(`Quiz not found`);

    return res.ok(`Questions fetched successfully`, questions.data);
  } catch (err) {
    next(err);
  }
});

export default questionRouter;
