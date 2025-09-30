import express from "express";
import { answer_schema, quiz_schema } from "../utils/Schema.Zod.js";
import {
  create_quiz,
  find_all_quiz,
  calculate_score,
} from "../service/QuizService.js";

const quizRouter = express.Router();

quizRouter.post("/", async (req, res, next) => {
  const validationResult = quiz_schema.safeParse(req.body);
  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    return res.bad_request("Validation failed", errorMessages);
  }

  try {
    const { title } = req.body;
    const quiz = await create_quiz(title);
    if (!quiz) return res.server_error("Something went wrong with server DB");

    return res.created("Quiz created successfully", quiz);
  } catch (err) {
    next(err);
  }
});

quizRouter.get("/", async (req, res, next) => {
  try {
    const quiz = await find_all_quiz();
    if (!quiz) return res.server_error("Something went wrong with server DB");
    return res.ok("Quiz Found!", quiz);
  } catch (err) {
    next(err);
  }
});

quizRouter.post("/answer/:id", async (req, res, next) => {
  const validationResult = answer_schema.safeParse(req.body);
  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    return res.bad_request("Validation failed", errorMessages);
  }

  try {
    const jwt = req.cookies.token;
    const quizId = parseInt(req.params.id, 10);

    const scores = await calculate_score(quizId, req.body, jwt);

    if (!scores.success) return res.not_found(`Quiz not found`);
    return res.created(scores.message, scores.data);
  } catch (err) {
    next(err);
  }
});

export default quizRouter;
