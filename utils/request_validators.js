import { z } from "zod";

const create_quiz_schema = z.object({
  title: z
    .string({ required_error: "title(string) must be provided" })
    .nonempty("title cannot be empty"),
});

const QuestionType = z.enum(["MCQ", "MSQ", "SUB"]);

const question_schema = z.object({
    question: z.string().nonempty("Question cannot be empty"),
    option: z.array(z.string()).min(1, "Option must have at least 1 element"),
    correctoption: z.array(z.number()),
    type: QuestionType,
    score: z.number("Please give score of question"),
  }).refine((data) => {
    const { type, option, correctoption } = data;
  
    if (correctoption.length > option.length) return false;
  
    if (type === "MCQ" && correctoption.length !== 1 && correctoption >= option.length) return false;
    if (type === "MSQ" && (correctoption.length < 1 || correctoption.length > option.length)) return false;

    if(correctoption.filter(opt => opt >= option.length).length > 0) return false;
  
    return true;
  }, {
    message: "Correct options do not satisfy the rules for the question type",
  });

const create_question_schema = z.array(question_schema);


export { create_quiz_schema, create_question_schema };