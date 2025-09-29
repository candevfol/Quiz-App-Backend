import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const create_question = async (quizId, body) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });
  if (!quiz) {
    return { success: false };
  }
  let data = [];
  const addedQuestions = await Promise.all(
    body.map((quest) => {
      return prisma.questions.create({
        data: {
          question: quest.question,
          score: quest.score ?? 0,
          type: quest.type,
          quizId: quizId,
        },
      });
    })
  );

  const addedOptions = await Promise.all(
    body.flatMap((quest, ind) => {
      if (quest.type === "SUB") {
        return [
          prisma.option.create({
            data: {
              content: quest.correctoption,
              questionId: addedQuestions[ind].id,
            },
          }),
        ];
      } else {
        return quest.option.map((opt) => {
          return prisma.option.create({
            data: {
              content: opt,
              questionId: addedQuestions[ind].id,
            },
          });
        });
      }
    })
  );
  let start_index = 0;
  const addedCorrectOptions = await Promise.all(
    body.flatMap((quest, ind1) => {
      let current_index = start_index;
      quest.type !== "SUB"
        ? (start_index += quest.option.length)
        : start_index++;
      if (quest.type === "SUB") {
        return [
          prisma.correctOption.create({
            data: {
              questionId: addedQuestions[ind1].id,
              ansId: addedOptions[current_index].id,
            },
          }),
        ];
      } else {
        return quest.correctoption.map((opt, ind2) => {
          return prisma.correctOption.create({
            data: {
              questionId: addedQuestions[ind1].id,
              ansId: addedOptions[opt + current_index].id,
            },
          });
        });
      }
    })
  );

  return { success: true };
};
const find_all_question = async (quizId) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });
  if (!quiz) {
    return { success: false };
  }

  const allQuestions = await prisma.questions.findMany({
    where: { quizId: quizId },
    include: {
      Option: {
        select: {
          id: true,
          content: true,
        },
      },
    },
  });

  return { success: true, data: allQuestions };
};

export { create_question, find_all_question };
