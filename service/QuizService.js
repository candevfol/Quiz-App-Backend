import { PrismaClient } from "@prisma/client";
import { compare_answer } from "./GeminiService.js";
import jwt from "jsonwebtoken"
import userRouter from "../router/User.js";

const prisma = new PrismaClient();

const create_quiz = async (title) => {
  const quiz = await prisma.quiz.create({
    data: {
      title,
    },
  });
  return quiz;
};

const find_all_quiz = async () => {
  const quiz = await prisma.quiz.findMany();
  return quiz;
};

const calculate_score = async (quizId, body, token) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });
  if (!quiz) {
    return { success: false };
  }
  let scores = [];
  for (const ans of body) {
    const question = await prisma.questions.findUnique({
      where: { id: ans.questionId },
    });
    if (!question) {
      scores.push(0);
      continue;
    }
    if (question.type === "SUB") {
      const userAnswer = ans.answer;
      const correctAnswer_object = await prisma.option.findMany({
        where: {
          questionId: question.id,
        },
      });
      const correctAnswer = correctAnswer_object[0].content;
      const isMatching = await compare_answer(
        userAnswer,
        correctAnswer,
        question.question
      );
      isMatching === "true" ? scores.push(question.score) : scores.push(0);
    } else {
      const correctAnswer_object = await prisma.correctOption.findMany({
        where: { questionId: question.id },
        include: {
          ans: {
            select: { id: true },
          },
        },
      });
      const correctAnswer = correctAnswer_object.map((c) => c.ans.id);

      const userAnswer = ans.answer;

      if (question.type === "MCQ") {
        userAnswer.length === 1 && correctAnswer[0] === userAnswer[0]
          ? scores.push(question.score)
          : scores.push(0);
      }
      if (question.type === "MSQ") {
        const allCorrect =
          userAnswer.length === correctAnswer.length &&
          userAnswer.every((id) => correctAnswer.includes(id));
        allCorrect ? scores.push(question.score) : scores.push(0);
      }
    }
  }

  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const username = jwt.verify(token, process.env.JWT_SECRET).username;
  await update_score(username, token, totalScore);
  return {
    success: true,
    data: totalScore,
    message: `Score Array: ${scores}`,
  };
};

const update_score = async (username, token, add) => {
  await prisma.user.update({
    where:{
      username:username
    },
    data:{
      score:{
        increment:add
      }
    }
  });
    
}

export { create_quiz, find_all_quiz, calculate_score };
