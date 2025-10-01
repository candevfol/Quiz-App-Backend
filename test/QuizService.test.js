jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(() => ({ userId: 1 })),
  sign: jest.fn(() => 'signed_token'),
}));

jest.mock("@prisma/client", () => {
  const quiz = { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn() };
  const questions = { findUnique: jest.fn(), create: jest.fn() };
  const option = { findMany: jest.fn(), create: jest.fn() };
  const correctOption = { findMany: jest.fn(), create: jest.fn() };
  const user = { update: jest.fn() };
  const prismaDouble = { quiz, questions, option, correctOption, user };
  return { PrismaClient: jest.fn().mockImplementation(() => prismaDouble) };
});

import { PrismaClient } from "@prisma/client";
import {mock_quiz, mock_body, mock_quizId, mock_token } from "./mockData.js"
import * as geminiService from "../service/GeminiService.js";
import { calculate_score } from "../service/QuizService.js";

const prisma = new PrismaClient();

describe("QuizService", () => {

    test("for calculating score", async () => {
        jest.spyOn(prisma.quiz, "findUnique").mockImplementation(async ({ where }) => {
            return mock_quiz
        })
        jest.spyOn(prisma.questions, "findUnique").mockImplementation(async ({ where }) => {
            if (where.id === 1) return { id: 1, question:"dummy-question-1",score:5,type:"MSQ" };
            if (where.id === 2) return { id: 2, question:"dummy-question-2",score:10,type:"MSQ" };
            if( where.id === 3) return { id: 3, question:"dummy-question-3",score:3,type:"MSQ" };
            if( where.id === 4) return { id: 4, question:"dummy-question-4",score:9,type:"MCQ" };
            if( where.id === 5) return { id: 5, question:"dummy-question-5",score:8,type:"MCQ" };
            if( where.id === 6) return { id: 6, question:"dummy-question-6",score:20,type:"SUB" };
            if( where.id === 7) return { id: 7, question:"dummy-question-7",score:30,type:"SUB" };
            return null;
          });
        jest.spyOn(prisma.option,"findMany").mockImplementation(async({where}) => {
            if(where.questionId === 6) return [{id: 1, content:"dummy-content", questionId:6}];
            if(where.questionId === 7) return [{id: 2, content:"dummy-content", questionId:7}];
            return null;
        })
        jest.spyOn(geminiService, "compare_answer").mockImplementation(async (userAnswer) => {
            return userAnswer === "This is correct" ? "true" : "false";
          });
        jest.spyOn(prisma.correctOption,"findMany").mockImplementation(async({where}) => {
            if(where.questionId === 1) return [{ans:{id:1}},{ans:{id:2}}];
            if(where.questionId === 2) return [{ans:{id:3}},{ans:{id:4}},{ans:{id:5}}];
            if(where.questionId === 3) return [{ans:{id:5}},{ans:{id:6}},{ans:{id:8}}];
            if(where.questionId === 4) return [{ans:{id:7}}];
            if(where.questionId === 5) return [{ans:{id:10}},{ans:{id:11}},{ans:{id:12}}];
            return null;
        })
        jest.spyOn(prisma.user, "update").mockImplementation(async () => {
            return ;
        })

        const repsonse = calculate_score(mock_quizId, mock_body, mock_token);
        expect(repsonse).resolves.toEqual({success: true, data: 37, message: "Score Array: 5,0,3,9,0,20,0"});



    })
})