import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const create_quiz = async (title) => {
    const quiz = await prisma.quiz.create({
        data: {
            title
          }
    })
    return quiz;
}

const getall_quiz = async() => {
    const quiz = await prisma.quiz.findMany();
    return quiz;
}

export {create_quiz, getall_quiz}