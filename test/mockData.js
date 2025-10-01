// // Centralized mocks and data setup for calculate_score

// export const quizId = 1;
// export const quiz = { id: quizId, title: "Scoring Quiz" };

// // 7 questions: 3 MCQ (2 correct), 2 MSQ (1 correct), 2 SUB (1 correct)
// export const Q = {
//   MCQ1: { id: 101, type: "MCQ", score: 2, question: "MCQ1" }, // correct
//   MCQ2: { id: 102, type: "MCQ", score: 2, question: "MCQ2" }, // correct
//   MCQ3: { id: 103, type: "MCQ", score: 2, question: "MCQ3" }, // wrong
//   MSQ1: { id: 201, type: "MSQ", score: 3, question: "MSQ1" }, // correct
//   MSQ2: { id: 202, type: "MSQ", score: 3, question: "MSQ2" }, // wrong
//   SUB1: { id: 301, type: "SUB", score: 5, question: "SUB1" }, // correct
//   SUB2: { id: 302, type: "SUB", score: 5, question: "SUB2" }, // wrong
// };

// // Correct answers for MCQ/MSQ: prisma.correctOption.findMany returns [{ ans: { id } }]
// export const correctOptionMap = {
//   [Q.MCQ1.id]: [{ ans: { id: 1001 } }],
//   [Q.MCQ2.id]: [{ ans: { id: 1002 } }],
//   [Q.MCQ3.id]: [{ ans: { id: 1003 } }],
//   [Q.MSQ1.id]: [{ ans: { id: 2001 } }, { ans: { id: 2003 } }],
//   [Q.MSQ2.id]: [{ ans: { id: 2101 } }, { ans: { id: 2102 } }],
// };

// // For SUB, prisma.option.findMany returns options; first one is treated as correct
// export const subOptionMap = {
//   [Q.SUB1.id]: [{ id: 3001, content: "SUB1 CORRECT" }],
//   [Q.SUB2.id]: [{ id: 3002, content: "SUB2 CORRECT" }],
// };

// // User answers: 2 MCQ correct, 1 wrong; 1 MSQ correct, 1 wrong; 1 SUB correct, 1 wrong
// export const userAnswers = [
//   { questionId: Q.MCQ1.id, answer: [1001] }, // correct
//   { questionId: Q.MCQ2.id, answer: [1002] }, // correct
//   { questionId: Q.MCQ3.id, answer: [9999] }, // wrong
//   { questionId: Q.MSQ1.id, answer: [2001, 2003] }, // correct (all match)
//   { questionId: Q.MSQ2.id, answer: [2101] }, // wrong (partial)
//   { questionId: Q.SUB1.id, answer: "SUB1 CORRECT" }, // correct (semantic via Gemini)
//   { questionId: Q.SUB2.id, answer: "WRONG SUB" }, // wrong
// ];

// export const expectedTotal =
//   Q.MCQ1.score +
//   Q.MCQ2.score +
//   /* MCQ3 wrong */ 0 +
//   Q.MSQ1.score +
//   /* MSQ2 wrong */ 0 +
//   Q.SUB1.score +
//   /* SUB2 wrong */ 0;

// // Build PrismaClient double with behavior matching calculate_score usage
// export function buildPrismaDouble(jest) {
//   const quiz_findUnique = jest.fn(async ({ where }) => (where.id === quizId ? quiz : null));

//   const questionIndex = new Map(
//     Object.values(Q).map((q) => [q.id, q])
//   );
//   const questions_findUnique = jest.fn(async ({ where }) => questionIndex.get(where.id) || null);

//   const option_findMany = jest.fn(async ({ where }) => subOptionMap[where.questionId] || []);

//   const correctOption_findMany = jest.fn(async ({ where }) => correctOptionMap[where.questionId] || []);

//   return {
//     quiz: { findUnique: quiz_findUnique },
//     questions: { findUnique: questions_findUnique },
//     option: { findMany: option_findMany },
//     correctOption: { findMany: correctOption_findMany },
//     __mocks: {
//       quiz_findUnique,
//       questions_findUnique,
//       option_findMany,
//       correctOption_findMany,
//     },
//   };
// }

// // Gemini mock: return "true" if submitted equals correct, otherwise "false"
// export function buildGeminiDouble() {
//   return {
//     compare_answer: jest.fn(async (submitted_answer, correct_answer) =>
//       submitted_answer === correct_answer ? "true" : "false"
//     ),
//   };
// }

const mock_body = [
  {"questionId": 1, "answer":[1,2]},  //correct-MSQ-score-5 --- optionId:1,2
  {"questionId": 2, "answer":[3,4]},  //wrong-MSQ-score-10 ---optionId:3,4,5
  {"questionId": 3, "answer":[5,6,8]}, //correct-MSQ-score-3 ---optionId: 6,7,8
  {"questionId": 4, "answer":[7]}, //correct-MCQ-score-9 ---optionId: 9
  {"questionId": 5, "answer":[9]}, // wrong-MCQ-score-8 ---optionId:10,11,12
  {"questionId": 6, "answer":"This is correct"}, //correct-SUB-score-20 
  {"questionId": 7, "answer":"This is wrong"} //wrong-SUB-score-30 
]
const mock_token = "mock_token"
const mock_quizId = 123

const mock_quiz = {
  id: 123,
  title: "Mock Quiz"
}

export { mock_body, mock_token, mock_quizId , mock_quiz }