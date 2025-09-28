import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const create_quiz = async (title) => {
  const quiz = await prisma.quiz.create({
    data: {
      title,
    },
  });
  return quiz;
};

const getall_quiz = async () => {
  const quiz = await prisma.quiz.findMany();
  return quiz;
};

const getScore = async (quizId, body) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });
  if (!quiz) {
    return { success: false, message: "quiz not found" };
  }
  let scoreArray = [];
  for (const ans of body) {
    const question = await prisma.questions.findUnique({
      where: { id: ans.questionId },
    });
    if (!question) {
      scoreArray.push(0);
      continue;
    }
    if (question.type === "SUB") {

    } else {
      const correct_option_ids_object = await prisma.correctOption.findMany({
        where: { questionId: question.id },
        include: {
          ans: {
            select: { id: true },
          },
        },
      });
      const correct_option_ids = correct_option_ids_object.map(c => c.ans.id);

      const submitted_option_ids = ans.answer;

      if (question.type === "MCQ" && submitted_option_ids.length === 1 && correct_option_ids[0] === submitted_option_ids[0]) {
        scoreArray.push(question.score);
      }
      if (question.type === "MSQ") {
        const isAllCorrect = submitted_option_ids.length === correct_option_ids.length && submitted_option_ids.every((id) => correct_option_ids.includes(id));
        if (isAllCorrect) scoreArray.push(question.score);
      }
    }
  }

  let totalScore = 0;
  scoreArray.forEach((score) => (totalScore += score));
  return {
    success: true,
    data: totalScore,
    message: `Total score array is: ${scoreArray}`,
  };
};

export { create_quiz, getall_quiz, getScore };
