import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const create_question = async (quizId, body) => {

    const quiz = await prisma.quiz.findUnique({
        where: { id:quizId }, 
      });
    if(!quiz){
        return { success:false, data: "quiz not found"};
    } 
    const question_add = await Promise.all(body.map(quest => {
        return prisma.questions.create({
            data: {
                question: quest.question,
                score: quest.score ?? 0,
                type: quest.type,
                quizId: quizId
            }
        })
    }) )
    const options_add = await Promise.all(body.flatMap((quest,ind) => {
        return quest.option.map(opt => {
            return prisma.option.create({
                data: {
                    content: opt,
                    questionId: question_add[ind].id
                }
            })
        })
    }))
    let start_index = 0;
    const correct_options_add = await Promise.all(body.flatMap((quest,ind1)=> {
        let current_index = start_index;
        start_index += quest.option.length;
        return quest.correctoption.map((opt,ind2)=> {
            return prisma.correctOption.create({
                data: {
                    questionId: question_add[ind1].id,
                    ansId: options_add[opt + current_index].id
                }
            })
        })
    }))
    
    return {success: true, data: "Question created successfully"}
}
const getAllQuestions = async(quizId) => {
    const quiz = await prisma.quiz.findUnique({
        where: { id:quizId }, 
      });
    if(!quiz){
        return { success:false, data: "quiz not found"};
    }
    const questions = await prisma.questions.findMany({
        where:{
            quizId:quizId
        }
    });
    return { success:true, data: questions};
}




export {create_question, getAllQuestions}