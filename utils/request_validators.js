import { z } from "zod";

const create_quiz_schema = z.object({
  title: z
    .string({ required_error: "title(string) must be provided" })
    .nonempty("title cannot be empty"),
});

const QuestionType = z.enum(["MCQ", "MSQ", "SUB"]);

// const question_schema = z.object({
//     question: z.string().nonempty("Question cannot be empty"),
//     option: z.array(z.string()).min(1, "Option must have at least 1 element").optional(),
//     correctoption: 
//         z.array(z.union([z.number()], [z.string()])), 
//     type: QuestionType,
//     score: z.number("Please give score of question"),
//   }).refine((data) => {
//     if(data.type==="SUB"){
//         if(data.correctoption.length !== 1 ) return false;
//         return true;
//     }
//     else{
//         const { type, option, correctoption } = data;
    
//         if (correctoption.length > option.length) return false;
    
//         if (type === "MCQ" && correctoption.length !== 1 && correctoption >= option.length) return false;
//         if (type === "MSQ" && (correctoption.length < 1 || correctoption.length > option.length)) return false;

//         if(correctoption.filter(opt => opt >= option.length).length > 0) return false;
    
//         return true;
//     }
//   }, {
//     message: "Correct options do not satisfy the rules for the question type",
//   });

const mcqSchema = z.object({
    question: z.string().nonempty("Question cannot be empty"),
    option: z.array(z.string()).min(1, "Option must have at least 1 element"),
    correctoption: z.array(z.number()).min(1, "MCQ must have at least one correct option"),
    type: z.literal("MCQ"),
    score: z.number("Please give score of question"),
  });
  
  const msqSchema = z.object({
    question: z.string().nonempty("Question cannot be empty"),
    option: z.array(z.string()).min(1, "Option must have at least 1 element"),
    correctoption: z.array(z.number()).min(1, "MSQ must have at least one correct option"),
    type: z.literal("MSQ"),
    score: z.number("Please give score of question"),
  });
  
  const subSchema = z.object({
    question: z.string().nonempty("Question cannot be empty"),
    correctoption: z.string().nonempty("Answer for SUB cannot be empty"),
    type: z.literal("SUB"),
    score: z.number("Please give score of question"),
  });
  
  const question_schema = z.discriminatedUnion("type", [mcqSchema, msqSchema, subSchema]);
  const create_question_schema = z.array(question_schema)

export { create_quiz_schema, create_question_schema };