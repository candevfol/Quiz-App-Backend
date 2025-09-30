import { configDotenv } from "dotenv";
configDotenv({});

import express from "express";
import quizRouter from "./router/Quiz.js";
import questionRouter from "./router/Question.js";
import responseMiddleware from "./middlewares/ResponseHandler.js";
import userRouter from "./router/User.js";
import cookieParser from "cookie-parser";
import AuthenticationMiddleware  from "./middlewares/Authentication.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(responseMiddleware);

const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => res.ok(`Everyhting is working fine!`));
app.use('/api/user', userRouter); //Login and Logout apis

app.use(AuthenticationMiddleware); 

app.use("/api/quiz", quizRouter);
app.use("/api/question", questionRouter);


app.use((err, req, res, next) => {
  res.server_error("Something went wrong", err.message);
});

app.listen(PORT, () => {
  console.log(`App is listning to port number: ${PORT}`);
});
