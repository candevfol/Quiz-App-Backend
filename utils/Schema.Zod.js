import { z } from "zod";

const quiz_schema = z.object({
  title: z
    .string({ required_error: "title(string) must be provided" })
    .nonempty("title cannot be empty"),
});

const mcq_schema = z.object({
  question: z.string().nonempty("Question cannot be empty"),
  option: z.array(z.string()).min(1, "Option must have at least 1 element"),
  correctoption: z
    .array(z.number())
    .min(1, "MCQ must have at least one correct option"),
  type: z.literal("MCQ"),
  score: z.number("Please give score of question"),
});

const msq_schema = z.object({
  question: z.string().nonempty("Question cannot be empty"),
  option: z.array(z.string()).min(1, "Option must have at least 1 element"),
  correctoption: z
    .array(z.number())
    .min(1, "MSQ must have at least one correct option"),
  type: z.literal("MSQ"),
  score: z.number("Please give score of question"),
});

const subject_schema = z.object({
  question: z.string().nonempty("Question cannot be empty"),
  correctoption: z.string().nonempty("Answer for SUB cannot be empty"),
  type: z.literal("SUB"),
  score: z.number("Please give score of question"),
});

const sub_question_schema = z.discriminatedUnion("type", [
  mcq_schema,
  msq_schema,
  subject_schema,
]);
const question_schema = z.array(sub_question_schema);

const sub_answer_schema = z.object({
  questionId: z.number(),
  answer: z.union([z.array(z.number()), z.string()]),
});
const answer_schema = z.array(sub_answer_schema);

const login_schema = z.object({
  username:z.string().nonempty("Username cannot be empty"),
  password:z.string().min(6, "Password must be at least 6 characters")
})

export { quiz_schema, question_schema, answer_schema, login_schema };
